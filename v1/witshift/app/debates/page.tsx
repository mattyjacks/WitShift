import Link from "next/link";
import { listDebates } from "@/lib/actions/debates";
import { createClient } from "@/lib/supabase/server";

type DebateRow = {
  id: string;
  title: string;
  created_at: string;
  display_name: string | null;
};

function getDisplayName(p: DebateRow): string {
  return p.display_name || "Anonymous";
}

export const dynamic = "force-dynamic";

export default async function DebatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const debates: DebateRow[] = await listDebates();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Debates</h1>
      {user ? (
        <Link href="/debates/new" className="underline text-sm mb-6 inline-block">Start new debate</Link>
      ) : (
        <p className="text-sm mb-6">Sign in to <Link href="/auth/login" className="underline">start new debate</Link></p>
      )}
      <ul className="space-y-3">
        {debates.map((d) => (
          <li key={d.id} className="border p-3 rounded">
            <Link href={`/debates/${d.id}`}>{d.title}</Link>
            <p className="text-xs text-gray-500">
              {getDisplayName(d)} · {new Date(d.created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
