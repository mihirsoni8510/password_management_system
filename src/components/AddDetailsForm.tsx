"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AddPasswordFormProps, PasswordFromData } from "@/types/types";
import { supabase } from "@/lib/supabase";

export default function AddPasswordForm({
  open,
  setOpen,
  refresh,
  projectId,
}: AddPasswordFormProps) {
  const [form, setForm] = useState<PasswordFromData>({
    service_name: "",
    url: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    await supabase.from("passwords").insert({
      ...form,
      last_updated: new Date().toISOString(),
    });

    const res = await fetch(`/api/password/${projectId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    setOpen(false);
    refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Password</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="mb-3 ">Service Name</Label>
            <Input
              value={form.service_name}
              onChange={(e) =>
                setForm({ ...form, service_name: e.target.value })
              }
            />
          </div>
          <div>
            <Label className="mb-3 ">URL</Label>
            <Input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-3 ">Email</Label>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <Label className="mb-3 ">Password</Label>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
