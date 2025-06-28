import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuid } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // CORS preflight
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    return res.status(200).end();
  }
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  const supabase = await createClient();

  const filename = `${uuid()}.webm`;
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  const { error } = await supabase.storage.from("voice").upload(filename, buffer, {
    contentType: "audio/webm",
  });
  if (error) {
    console.error(error);
    return res.status(500).json({ error: "upload failed" });
  }
  const { data } = supabase.storage.from("voice").getPublicUrl(filename);
  return res.status(200).json({ url: data.publicUrl });
}
