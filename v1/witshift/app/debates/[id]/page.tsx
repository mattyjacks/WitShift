import { getDebateWithPosts, createPost } from "@/lib/actions/debates";
import type { Metadata } from "next";
import Link from "next/link";
import VoiceField from "@/components/voice-field";
import CooldownTimer from "@/components/cooldown-timer";
import { notFound } from "next/navigation";

type PostRow = {
  id: string;
  content_text: string | null;
  audio_url: string | null;
  transcript: string | null;
  display_name: string | null;
};

function getDisplayName(p: { display_name: string | null }): string {
  return p.display_name || "Anonymous";
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  const { data: debate } = await supabase.from("debates").select("title").eq("id", id).single();
  const titlePart = debate?.title ? debate.title.slice(0, 50) : "Debate";
  const fullTitle = `WitShift: ${titlePart}`;
  const desc = debate?.title ? `${debate.title.slice(0, 50)} – Join the debate on WitShift.` : "Debate on WitShift.";
  return {
    title: fullTitle,
    description: desc,
    openGraph: { title: fullTitle, description: desc },
    twitter: { title: fullTitle, description: desc },
  };
}

export default async function DebateThread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { debate, posts } = await getDebateWithPosts(id);
  const typedPosts: PostRow[] = posts;
  const supabase = await (await import("@/lib/supabase/server")).createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const unlockAt = user ? await (await import("@/lib/actions/debates")).getCooldown(id, user.id) : null;
  if (!debate) notFound();

  async function serverAction(formData: FormData) {
    "use server";
    const content = String(formData.get("content") || "");
    const audioUrl = String(formData.get("audioUrl") || "");
    await createPost({ debateId: id, contentText: content || undefined, audioUrl: audioUrl || undefined });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{debate.title}</h1>
      <ul className="space-y-4">
        {typedPosts.map((p) => (
          <li key={p.id} className="border p-3 rounded">
            <p className="text-xs text-gray-500 mb-1">{getDisplayName(p)}</p>
            {p.content_text && <p>{p.content_text}</p>}
            {p.audio_url && (
              <audio controls src={p.audio_url} className="mt-2 w-full" />
            )}
            {p.transcript && (
              <p className="text-xs text-gray-500 mt-1">{p.transcript}</p>
            )}
          </li>
        ))}
      </ul>
      <CooldownTimer unlockAt={unlockAt?.toISOString() ?? null} />
      {user ? (
        <form action={serverAction} className="flex flex-col gap-2 border-t pt-4">
          <textarea
            name="content"
            placeholder="Your reply"
            rows={3}
            className="border p-2 rounded"
          />
          <VoiceField />
          <button type="submit" disabled={Boolean(unlockAt && unlockAt > new Date())} className="bg-black text-white rounded px-4 py-2 disabled:opacity-50">
            Post reply
          </button>
        </form>
      ) : (
        <p className="border-t pt-4 text-sm">Sign in to <Link href="/auth/login" className="underline">post reply</Link></p>
      )}
    </div>
  );
}
