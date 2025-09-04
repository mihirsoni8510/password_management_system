"use server";

import { supabase } from "@/lib/supabase";
import { Project, Password } from "@/types/types";

// Fetch all projects
export async function fetchProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Project[];
}

// Fetch passwords for a project
export async function fetchPasswords(projectId: string) {
  const { data, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("project_id", projectId)
    .order("last_updated", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Password[];
}

// Delete a project
export async function deleteProject(projectId: string) {
  const { error } = await supabase.from("projects").delete().eq("id", projectId);

  if (error) throw new Error(error.message);
}
