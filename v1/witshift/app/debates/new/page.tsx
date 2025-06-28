import { createDebate } from "@/lib/actions/debates";

export default function NewDebatePage() {
  return (
    <form action={createDebate} className="max-w-xl mx-auto p-6 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Start a new debate</h1>
      <input
        type="text"
        name="title"
        placeholder="Debate title"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-black text-white rounded px-4 py-2">
        Create
      </button>
    </form>
  );
}
