"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project } from "@/types/types";
import { Pencil, Trash2, Plus } from "lucide-react";
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

  if (loadingProject) return <p className="p-6">Loading project...</p>;
  if (!project) return <p className="p-6 text-red-500">Project not found</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="flex items-center gap-2"
        >
          ← Back
        </Button>
        <h1 className="text-2xl font-bold text-center flex-1">
          {project.name}
        </h1>
      </div>

      <div className="mb-6 text-sm text-gray-600">
        <p>
          <strong>Client:</strong> {project.client_name || "N/A"}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {project.start_date
            ? new Date(project.start_date).toLocaleDateString()
            : "Not set"}
        </p>
      </div>

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold">Related Credential</h2>
        <Button onClick={() => setAddDetailsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add
        </Button>
      </div>

      {loadingPasswords ? (
        <p className="text-gray-500 italic">Loading credentials...</p>
      ) : passwords.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Password</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {passwords.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.service_name}</TableCell>
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
                <TableCell className="font-mono">{p.password}</TableCell>
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
                onChange={(e) => {
                  setPasswords((prev) =>
                    prev.map((pwd) =>
                      pwd.id === selectedPasswordId
                        ? { ...pwd, confirmInput: e.target.value }
                        : pwd
                    )
                  );
                }}
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
                <Label htmlFor="service">Service Name</Label>
                <Input
                  id="service"
                  value={editData.service_name}
                  onChange={(e) =>
                    setEditData({ ...editData, service_name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  value={editData.url}
                  onChange={(e) =>
                    setEditData({ ...editData, url: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
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

      <AddPasswordForm
        open={addDetailsOpen}
        setOpen={setAddDetailsOpen}
        refresh={() => fetchPasswords(id as string)}
        projectId={id as string}
      />
    </div>
  );
}
