import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// GET passwords for a project
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("project_id", id)
    .order("last_updated", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// POST → Add password
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await req.json();
  const { service_name, url, email, password } = body;

  if (!service_name || !url || !email || !password) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.from("passwords").insert({
    service_name,
    url,
    email,
    password,
    project_id: id,
    last_updated: new Date().toISOString(),
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// PUT → Update password
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const updates = await req.json();

  if (!updates || Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No updates provided" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("passwords")
    .update({ ...updates, last_updated: new Date().toISOString() })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json(data);
}

// DELETE → Remove password
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("passwords").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
