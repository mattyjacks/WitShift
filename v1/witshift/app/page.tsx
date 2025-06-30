import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";

import { Sparkles, Mic2, Clock, Users, MessageSquare, ShieldCheck, Brain, FileText, Badge, Gavel, ListChecks } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-sky-50 to-white">
      <div className="flex-1 w-full flex flex-col gap-20 items-center">
        {/* Hero */}
        <section className="w-full py-24 bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-center">
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">WitShift</h1>
          <p className="text-xl max-w-2xl mx-auto">
            A turn-based, voice-first debating arena with ChatGPT Judgements where every
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
              { icon: Clock, title: "60-min Cooldown", desc: "Post once, wait an hour—quality over quantity." },
              { icon: Mic2, title: "Voice Recording", desc: "Speak your mind with crystal-clear audio clips." },
              { icon: Sparkles, title: "Avatar Halo", desc: "Animated glow reacts to your voice’s volume and pitch." },
              { icon: Users, title: "Targeted Challenges", desc: "Call out individuals or groups to a public sparring match." },
              { icon: Brain, title: "AI Judgement", desc: 'ChatGPT decides "Who won the debate?" and explains why.' },
              { icon: Users, title: "Limited Arena", desc: "Only 10 debaters & 25 messages keep things concise." },
              { icon: Mic2, title: "OpenAI Whisper Transcription", desc: "High-accuracy speech-to-text preserves tone & content." },
              { icon: ShieldCheck, title: "Safety from Extremism", desc: "Automated moderation shields you from hateful content." },
              { icon: Sparkles, title: "Points & Fame", desc: "Earn upvotes, legendary status & ChatGPT Judgement scorecards." },
              { icon: MessageSquare, title: "Threaded Depth", desc: "Replies stack like chess moves, keeping arguments clear." },
              { icon: FileText, title: "Text Context", desc: "Embed links, citations & comments alongside your voice." },
              { icon: Badge, title: "Avatar Frames", desc: "Unlock rare avatar frames by completing challenges." },
            ].map((f) => (
              <div key={f.title} className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <f.icon className="h-8 w-8 text-sky-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-gray-800">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ChatGPT Judgements */}
        <section className="max-w-5xl mx-auto px-4 py-20">
          <h2 className="text-3xl font-bold text-center mb-12">ChatGPT Judgements</h2>
          <p className="text-center text-gray-700 max-w-3xl mx-auto mb-12">
            Our AI analysis goes beyond basic moderation—it creates a rich ecosystem of insights, awards, and personalized feedback that evolves with every debate.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <Gavel className="h-8 w-8 text-sky-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">Debate Deciding</h3>
              <p className="text-sm text-gray-800 mb-3">
                After each match concludes, ChatGPT delivers a neutral <em>Who Won?</em> verdict based on a comprehensive analysis of argument quality, evidence presented, rhetorical skill, and logical consistency—not personal bias or political leaning.
              </p>
              <p className="text-sm text-gray-800 mb-3">
                Each participant receives a detailed <strong>Judgement Scorecard</strong> with ratings across multiple dimensions: Persuasiveness, Evidence Quality, Logical Coherence, Rhetorical Skill, and Audience Impact.
              </p>
              <p className="text-sm text-gray-800">
                Winners earn mystical <strong>Machine Spirits</strong>—collectible achievements that appear on your profile alongside other stats. For complete transparency, we publish the <strong>full</strong> AI response, including any internal reasoning and tool calls.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <ListChecks className="h-8 w-8 text-sky-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">User Traits</h3>
              <p className="text-sm text-gray-800 mb-3">
                ChatGPT builds a living profile of your debating style by analyzing your speeches and text contributions across three dimensions:
              </p>
              <ul className="list-disc pl-5 text-sm text-gray-800 mb-3">
                <li><strong>Personality:</strong> Happiness, Sadness, Hope, Anger, Curiosity, Empathy, Conciseness, Boldness, Logical Rigour, Humor, Diplomacy, Creativity, Confidence, Open-Mindedness</li>
                <li><strong>Opinions:</strong> A summary of your positions on topics you&apos;ve debated, helping others understand your perspective</li>
                <li><strong>Knowledge:</strong> Subject areas where you demonstrate expertise and accuracy</li>
              </ul>
              <p className="text-sm text-gray-800">
                Add custom traits to track, and discover debaters with similar, complementary, or competitive profiles to yours, perfect for finding intellectual sparring partners or allies.
              </p>
            </div>
          </div>
          <div className="bg-gradient-to-r from-sky-100 to-indigo-100 p-6 rounded-lg">
            <h3 className="font-semibold text-lg mb-2 text-center">How It Works</h3>
            <p className="text-sm text-gray-800 mb-3 text-center">
              Our AI judgement system uses carefully crafted prompts designed for neutrality and fairness. Unlike typical AI interactions, we provide complete transparency by showing you the exact instructions given to ChatGPT and its full, unedited response, including its internal reasoning process.
            </p>
            <p className="text-sm text-gray-800 text-center">
              This approach ensures judgements are based on debate quality rather than political alignment or personal bias, creating a level playing field for all perspectives.
            </p>
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
