// import { supabase } from "@/lib/supabase";
// import { NextResponse } from "next/server";

// // GET passwords for a project
// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   console.log(req.url,'hiiiiiiiiurl')
//   const projectId = searchParams.get("projectId");
//   if (!projectId) {
//     return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
//   }

//   const { data, error } = await supabase
//     .from("passwords")
//     .select("*")
//     .eq("project_id", projectId)
//     .order("last_updated", { ascending: false });

//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   return NextResponse.json(data);
// }

// // POST → Add password
// export async function POST(req: Request) {
//   const body = await req.json();
//   const { service_name, url, email, password, project_id } = body;

//   const { data, error } = await supabase.from("passwords").insert({
//     service_name,
//     url,
//     email,
//     password, // ❗ encrypt before storing in production
//     project_id,
//     last_updated: new Date().toISOString(),
//   });

//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   return NextResponse.json(data);
// }

// // PUT → Update password
// export async function PUT(req: Request) {
//   const body = await req.json();
//   const { id, ...updates } = body;

//   const { data, error } = await supabase
//     .from("passwords")
//     .update({ ...updates, last_updated: new Date().toISOString() })
//     .eq("id", id);

//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 400 });
//   return NextResponse.json(data);
// }

// // DELETE → Remove password
// export async function DELETE(req: Request) {
//   const body = await req.json();
//   const { id } = body;

//   const { error } = await supabase.from("passwords").delete().eq("id", id);
//   if (error)
//     return NextResponse.json({ error: error.message }, { status: 400 });

//   return NextResponse.json({ success: true });
// }
