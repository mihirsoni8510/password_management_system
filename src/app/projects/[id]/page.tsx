"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types/types";
import { Pencil, Trash2, Plus, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddPasswordForm from "@/components/AddDetailsForm";
import { Label } from "@/components/ui/label";

interface PasswordData {
  id: string;
  service_name: string;
  url: string;
  email: string;
  password: string;
  last_updated: string;
  confirmInput?: string;
}

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [passwords, setPasswords] = useState<PasswordData[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingPasswords, setLoadingPasswords] = useState(true);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPasswordId, setSelectedPasswordId] = useState<string | null>(
    null
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState<PasswordData | null>(null);

  const [addDetailsOpen, setAddDetailsOpen] = useState(false);

  useEffect(() => {
    if (id) {
      setLoadingProject(true);
      fetch(`/api/projects/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Not found");
          return res.json();
        })
        .then((data) => setProject(data))
        .catch(() => setProject(null))
        .finally(() => setLoadingProject(false));

      fetchPasswords(id as string);
    }
  }, [id]);

  const fetchPasswords = async (projectId: string) => {
    setLoadingPasswords(true);
    try {
      const res = await fetch(`/api/password/${projectId}`);
      const data = await res.json();
      setPasswords(data);
    } finally {
      setLoadingPasswords(false);
    }
  };

  const handleDeletePassword = async () => {
    if (!selectedPasswordId) return;

    await fetch(`/api/password/${selectedPasswordId}`, {
      method: "DELETE",
    });

    setDeleteModalOpen(false);
    fetchPasswords(id as string);
  };

  const handleUpdatePassword = async () => {
    if (!editData) return;

    await fetch(`/api/password/${editData.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_name: editData.service_name,
        url: editData.url,
        email: editData.email,
        password: editData.password,
      }),
    });

    setEditModalOpen(false);
    fetchPasswords(id as string);
  };

  const formatUrl = (url: string, mode: "domain" | "shortPath" = "domain") => {
    try {
      const u = new URL(url);

      if (mode === "domain") {
        return u.hostname;
      }

      if (mode === "shortPath") {
        return (
          u.hostname +
          (u.pathname.length > 10
            ? u.pathname.slice(0, 10) + "..."
            : u.pathname)
        );
      }

      return u.hostname;
    } catch {
      return url;
    }
  };
  if (loadingProject) {
    return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-8 w-48 bg-gray-200 rounded-md animate-pulse" />
        <div className="h-10 w-20 bg-gray-200 rounded-md animate-pulse" />
      </div>

      {/* Project Info Skeleton */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Related Credentials Skeleton */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse" />
          <div className="h-9 w-20 bg-gray-200 rounded-md animate-pulse" />
        </div>

        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-6 gap-4 items-center border-b pb-3 last:border-0"
            >
              {/* Service */}
              <div className="h-5 w-16 bg-gray-200 rounded animate-pulse" />
              {/* URL */}
              <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
              {/* Email */}
              <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              {/* Password (varying widths for realism) */}
              <div
                className={`h-5 bg-gray-200 rounded animate-pulse ${
                  i % 3 === 0 ? "w-16" : i % 3 === 1 ? "w-24" : "w-32"
                }`}
              />
              {/* Last Updated */}
              <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
              {/* Actions */}
              <div className="flex gap-2">
                <div className="h-6 w-6 bg-gray-200 rounded-md animate-pulse" />
                <div className="h-6 w-6 bg-gray-200 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    );
  }
  if (!project) return <p className="p-6 text-red-500">Project not found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 !p-4 mt-2 "
        >
          <ChevronLeft size={50} className="!w-[25px] !h-[25px]" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 w-full text-center">
          {project.name}
        </h1>
      </div>

      {/* Project Info */}
      <div className="bg-white shadow-sm rounded-2xl p-5 border border-gray-200">
        <h2 className="text-lg font-semibold mb-3">Project Info</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <div>
            <dt className="font-medium text-gray-700">Client</dt>
            <dd className="text-gray-900">{project.client_name || "N/A"}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-700">Start Date</dt>
            <dd className="text-gray-900">
              {project.start_date
                ? new Date(project.start_date).toLocaleDateString()
                : "Not set"}
            </dd>
          </div>
        </dl>
      </div>

      {/* Credentials Section */}
      <div className="bg-white shadow-sm rounded-2xl p-5 border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Related Credentials</h2>
          <Button
            onClick={() => setAddDetailsOpen(true)}
            size="sm"
            className="cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>

        { passwords.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[150px]">Service</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Password</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passwords.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {p.service_name}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {formatUrl(p.url, "domain")}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="break-all">{p.url}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{p.email}</TableCell>
                  <TableCell className="font-mono text-gray-700">
                    {p.password}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {new Date(p.last_updated).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setEditData(p);
                        setEditModalOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => {
                        setSelectedPasswordId(p.id);
                        setDeleteModalOpen(true);
                      }}
                      className="cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-gray-500 italic">No related entries found.</p>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Delete Confirmation
            </DialogTitle>
          </DialogHeader>
          {selectedPasswordId && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This action{" "}
                <span className="font-semibold text-red-500">
                  cannot be undone
                </span>
                . To confirm, please type{" "}
                <strong>
                  &quot;
                  {
                    passwords.find((p) => p.id === selectedPasswordId)
                      ?.service_name
                  }
                  &quot;
                </strong>{" "}
                below:
              </p>
              <Input
                placeholder="Type service name here..."
                value={
                  passwords.find((p) => p.id === selectedPasswordId)
                    ?.confirmInput ?? ""
                }
                onChange={(e) =>
                  setPasswords((prev) =>
                    prev.map((pwd) =>
                      pwd.id === selectedPasswordId
                        ? { ...pwd, confirmInput: e.target.value }
                        : pwd
                    )
                  )
                }
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeletePassword}
              disabled={
                !selectedPasswordId ||
                passwords.find((p) => p.id === selectedPasswordId)
                  ?.confirmInput !==
                  passwords.find((p) => p.id === selectedPasswordId)
                    ?.service_name
              }
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Details</DialogTitle>
          </DialogHeader>
          {editData && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="service" className="mb-3">
                  Service Name
                </Label>
                <Input
                  id="service"
                  value={editData.service_name}
                  onChange={(e) =>
                    setEditData({ ...editData, service_name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="url" className="mb-3">
                  URL
                </Label>
                <Input
                  id="url"
                  value={editData.url}
                  onChange={(e) =>
                    setEditData({ ...editData, url: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="email" className="mb-3">
                  Email
                </Label>
                <Input
                  id="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="password" className="mb-3">
                  Password
                </Label>
                <Input
                  id="password"
                  value={editData.password}
                  onChange={(e) =>
                    setEditData({ ...editData, password: e.target.value })
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePassword}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Password Form */}
      <AddPasswordForm
        open={addDetailsOpen}
        setOpen={setAddDetailsOpen}
        refresh={() => fetchPasswords(id as string)}
        projectId={id as string}
      />
    </div>
  );
}
