import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET passwords for a project
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const projectId = id;
  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("passwords")
    .select("*")
    .eq("project_id", projectId)
    .order("last_updated", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// POST → Add password
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;

  const projectId = id;
  const body = await req.json();
  const { service_name, url, email, password } = body;

  const { data, error } = await supabase.from("passwords").insert({
    service_name,
    url,
    email,
    password,
    project_id: projectId,
    last_updated: new Date().toISOString(),
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// PUT → Update password
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  const updates = await req.json();

  const { data, error } = await supabase
    .from("passwords")
    .update({ ...updates, last_updated: new Date().toISOString() })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = await  params;

  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase.from("passwords").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ success: true });
}
