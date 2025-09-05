"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AddPasswordForm from "@/components/AddDetailsForm";
import AddProjectForm from "@/components/AddProjectForm";
import { Project, Password } from "@/types/types";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation"; 

export default function Dashboard() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [passwords, setPasswords] = useState<Record<string, Password[]>>({});

  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [confirmInput, setConfirmInput] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data as Project[]);
      data.forEach((proj) => fetchPasswords(proj.id));
    }
  };

  const fetchPasswords = async (projectId: string) => {
    const { data, error } = await supabase
      .from("passwords")
      .select("*")
      .eq("project_id", projectId)
      .order("last_updated", { ascending: false });

    if (!error && data) {
      setPasswords((prev) => ({ ...prev, [projectId]: data as Password[] }));
    }
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectToDelete.id);

    if (!error) {
      fetchProjects();
      setDeleteModalOpen(false);
      setConfirmInput("");
      setProjectToDelete(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/"); 
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Password Manager</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setSelectedProject(null);
              setProjectModalOpen(true);
            }}
          >
            + Add Project
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {projects.map((project) => (
          <Link
            key={project.id}
            href={`/projects/${project.id}`} 
            className="border p-4 rounded-lg block"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">{project.name}</h2>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedProject(project);
                    setProjectModalOpen(true);
                  }}
                >
                  <Pencil className="h-5 w-5" />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    setProjectToDelete(project);
                    setConfirmInput("");
                    setDeleteModalOpen(true);
                  }}
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            </div>

            <div className="mb-2 text-sm text-gray-600">
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
          </Link>
        ))}
      </div>

      <AddProjectForm
        open={projectModalOpen}
        setOpen={setProjectModalOpen}
        refresh={fetchProjects}
        project={selectedProject || undefined}
      />

      <AddPasswordForm
        open={passwordModalOpen}
        setOpen={setPasswordModalOpen}
        refresh={() => selectedProject && fetchPasswords(selectedProject.id)}
        projectId={selectedProject?.id || null}
      />

      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
          </DialogHeader>
          {projectToDelete && (
            <>
              <p className="mb-2 text-sm">
                This action is{" "}
                <span className="text-red-500">not reversible</span>. To
                confirm, type the project name{" "}
                <strong>&quot;{projectToDelete.name}&quot;</strong> below:
              </p>
              <Input
                placeholder="Type project name"
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value)}
              />
              <DialogFooter>
                <Button
                  variant="ghost"
                  onClick={() => setDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteProject}
                  disabled={confirmInput !== projectToDelete.name}
                >
                  Delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
