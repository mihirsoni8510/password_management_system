"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddProjectFormProps, Project } from "@/types/types";
import { addProject, updateProject } from "@/app/actions/projects";

interface Props extends AddProjectFormProps {
  project?: Project | null;
}

export default function AddProjectForm({
  open,
  setOpen,
  refresh,
  project,
}: Props) {
  const [name, setName] = useState("");
  const [clientName, setClientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClientName(project.client_name || "");
      setStartDate(project.start_date || "");
    } else {
      setName("");
      setClientName("");
      setStartDate("");
    }
  }, [project]);

  const handleSubmit = () => {
    if (!name.trim() || !clientName.trim() || !startDate) return;

    startTransition(async () => {
      try {
        if (project) {
          await updateProject(project.id, {
            name,
            client_name: clientName,
            start_date: startDate,
          });
        } else {
          await addProject({
            name,
            client_name: clientName,
            start_date: startDate,
          });
        }

        setName("");
        setClientName("");
        setStartDate("");
        setOpen(false);
        refresh();
      } catch (err: unknown) {
        if (err instanceof Error) {
          alert(err.message);
        } else {
          alert("Something went wrong");
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Add Project"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-4">
          <div>
            <Label className="mb-3">Client Name</Label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Enter client name"
            />
          </div>
          <div>
            <Label className="mb-3 ">Project Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
            />
          </div>
          <div>
            <Label className="mb-3">Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <Button
            className="w-full cursor-pointer"
            onClick={handleSubmit}
            disabled={isPending}
            
          >
            {isPending ? "Saving..." : project ? "Update" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
