import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

export async function createDebate(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const title = String(formData.get("title") || "").trim();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!title) throw new Error("Title required");
  const { data, error } = await supabase.from("debates").insert({ title, created_by: user.id }).select("id").single();
  if (error) throw error;
  revalidatePath("/debates");
  redirect(`/debates/${data.id}`);
}

export async function listDebates() {
  const supabase = await createClient();
  const { data: debates, error } = await supabase
    .from("debates")
    .select("id, title, created_at, created_by")
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!debates) return [];
  const userIds = debates.map((d) => d.created_by);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", userIds);
  const map: Record<string, string | null> = {};
  profiles?.forEach((p) => (map[p.id] = p.display_name));
  return debates.map((d) => ({ ...d, display_name: map[d.created_by] || null }));
}

export async function getCooldown(debateId: string, userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("cooldowns")
    .select("unlock_at")
    .eq("debate_id", debateId)
    .eq("user_id", userId)
    .maybeSingle();
  return data?.unlock_at ? new Date(data.unlock_at) : null;
}

export async function getDebateWithPosts(id: string) {
  const supabase = await createClient();
  const { data: debate, error: dErr } = await supabase.from("debates").select("*").eq("id", id).single();
  if (dErr) throw dErr;
  const { data: postsRaw, error: pErr } = await supabase
    .from("posts")
    .select("*")
    .eq("debate_id", id)
    .order("created_at", { ascending: true });
  if (pErr) throw pErr;
  const posts = postsRaw || [];
  const authorIds = posts.map((p) => p.author_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name")
    .in("id", authorIds);
  const pMap: Record<string, string | null> = {};
  profiles?.forEach((p) => (pMap[p.id] = p.display_name));
  const postsWithName = posts.map((p) => ({ ...p, display_name: pMap[p.author_id] || null }));
  if (pErr) throw pErr;
  return { debate, posts: postsWithName };
}

export async function createPost({ debateId, parentId, contentText, audioUrl }: { debateId: string; parentId?: string | null; contentText?: string; audioUrl?: string; }) {
  "use server";
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  // cooldown check
  const { data: cooldown } = await supabase.from("cooldowns").select("unlock_at").eq("user_id", user.id).eq("debate_id", debateId).maybeSingle();
  if (cooldown && new Date(cooldown.unlock_at) > new Date()) {
    throw new Error("Cooldown active");
  }
  const { error } = await supabase.from("posts").insert({ debate_id: debateId, parent_post_id: parentId, author_id: user.id, content_text: contentText, audio_url: audioUrl });
  if (error) throw error;
  // set cooldown 1h
  const unlock = new Date(Date.now() + 60 * 60 * 1000);
  await supabase.from("cooldowns").upsert({ user_id: user.id, debate_id: debateId, unlock_at: unlock });
  revalidatePath(`/debates/${debateId}`);
}
