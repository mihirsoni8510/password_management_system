"use server";

import { supabase } from "@/lib/supabase";

// Add project
export async function addProject(formData: {
  name: string;
  client_name: string;
  start_date: string;
}) {
  const { error } = await supabase.from("projects").insert({
    ...formData,
    created_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(error.message);
  }
}

// Update project
export async function updateProject(
  id: string,
  formData: { name: string; client_name: string; start_date: string }
) {
  const { error } = await supabase
    .from("projects")
    .update(formData)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
