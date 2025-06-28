import { getDebateWithPosts, createPost } from "@/lib/actions/debates";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function DebateThread({ params }: { params: { id: string } }) {
  const { debate, posts } = await getDebateWithPosts(params.id);
  if (!debate) notFound();

  async function serverAction(formData: FormData) {
    "use server";
    const content = String(formData.get("content") || "");
    await createPost({ debateId: params.id, contentText: content });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">{debate.title}</h1>
      <ul className="space-y-4">
        {posts.map((p) => (
          <li key={p.id} className="border p-3 rounded">
            <p>{p.content_text}</p>
            {p.audio_url && (
              <audio controls src={p.audio_url} className="mt-2 w-full" />
            )}
            {p.transcript && (
              <p className="text-xs text-gray-500 mt-1">{p.transcript}</p>
            )}
          </li>
        ))}
      </ul>
      <form action={serverAction} className="flex flex-col gap-2 border-t pt-4">
        <textarea
          name="content"
          placeholder="Your reply"
          rows={3}
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-black text-white rounded px-4 py-2">
          Post reply
        </button>
      </form>
    </div>
  );
}
