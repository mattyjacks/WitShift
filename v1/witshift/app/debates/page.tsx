import Link from "next/link";
import { listDebates } from "@/lib/actions/debates";

type Profile = { display_name: string | null };
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
  const debates = await listDebates();
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Debates</h1>
      <Link href="/debates/new" className="underline text-sm mb-6 inline-block">
        Start new debate
      </Link>
      <ul className="space-y-3">
        {debates.map((d) => (
          <li key={d.id} className="border p-3 rounded">
            <Link href={`/debates/${d.id}`}>{d.title}</Link>
            <p className="text-xs text-gray-500">
              {getDisplayName(d as any)} · {new Date((d as any).created_at).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
