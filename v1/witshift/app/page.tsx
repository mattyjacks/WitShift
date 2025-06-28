import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

import { Sparkles, Mic2, Clock, Users, MessageSquare, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-sky-50 to-white">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* Hero */}
        <section className="w-full py-24 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">WitShift</h1>
          <p className="text-xl max-w-2xl mx-auto">
            A turn-based, voice-first debating arena where every reply counts—and every
            move locks you out for an hour. Think before you speak.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link href="/debates" className="bg-white text-sky-600 px-6 py-3 rounded font-semibold shadow-lg hover:bg-slate-100">Explore Debates</Link>
            <AuthButton />
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">Why you’ll love WitShift</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "60-min Cooldown", desc: "Post a move and you’re benched for an hour—quality over quantity." },
              { icon: Mic2, title: "Voice + Transcript", desc: "Record tone-rich clips with automatic Whisper transcription." },
              { icon: Sparkles, title: "Avatar Halo", desc: "Animated glow reacts to your voice’s volume and pitch." },
              { icon: Users, title: "Targeted Challenges", desc: "Call out individuals or groups to a public sparring match." },
              { icon: MessageSquare, title: "Threaded Depth", desc: "Replies stack like chess moves, keeping arguments clear." },
              { icon: ShieldCheck, title: "Moderation Ready", desc: "RLS policies, profanity checks and report flow built-in." },
            ].map((f) => (
              <div key={f.title} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <f.icon className="h-8 w-8 text-sky-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-800">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
        <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
          <p>
            Powered by{" "}
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
          <ThemeSwitcher />
        </footer>
      </div>
    </main>
  );
}
