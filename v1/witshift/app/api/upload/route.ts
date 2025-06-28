import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuid } from "uuid";

export const runtime = "edge"; // Edge for faster upload handling
export const dynamic = "force-dynamic";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const filename = `${uuid()}.webm`;

  const arrayBuffer = await req.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error } = await supabase.storage.from("voice").upload(filename, buffer, {
    contentType: "audio/webm",
  });
  if (error) {
    return NextResponse.json({ error: "upload failed" }, { status: 500, headers: { "Access-Control-Allow-Origin": "*" } });
  }
  const { data } = supabase.storage.from("voice").getPublicUrl(filename);
  return NextResponse.json({ url: data.publicUrl }, { headers: { "Access-Control-Allow-Origin": "*" } });
}
