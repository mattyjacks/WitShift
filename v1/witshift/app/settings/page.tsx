import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function updateDisplayName(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const displayName = (formData.get("displayName") || "").toString().trim().slice(0, 64);
  // upsert into profiles
  const { error } = await supabase
    .from("profiles")
    .upsert({ id: user.id, display_name: displayName }, { onConflict: "id" });
  if (error) throw error;
  revalidatePath("/debates");
  redirect("/settings?updated=1");
}

export default async function SettingsPage({ searchParams }: { searchParams: Record<string, string | string[]> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .maybeSingle();
  const currentName = profile?.display_name || "";
  const updated = searchParams.updated;
  return (
    <div className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Account Settings</h1>
      {updated && <p className="text-green-600 text-sm">Updated!</p>}
      <form action={updateDisplayName} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium">Display Name (max 64)</span>
          <input
            type="text"
            name="displayName"
            defaultValue={currentName}
            maxLength={64}
            className="border p-2 rounded"
          />
        </label>
        <button type="submit" className="bg-black text-white rounded px-4 py-2 w-max">
          Save
        </button>
      </form>
    </div>
  );
}
