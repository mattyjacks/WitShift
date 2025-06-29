"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const supabase = createClient();
  const [user, setUser] = useState<null | { id: string }>(null);
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener?.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const pathname = usePathname();
  const linkClass = (href: string) =>
    `px-3 py-2 rounded hover:bg-gray-200 ${pathname === href ? "font-semibold" : ""}`;

  return (
    <nav className="w-full border-b mb-6">
      <div className="max-w-5xl mx-auto px-4 flex items-center h-12 gap-4">
        <Link href="/" className={linkClass("/")}>Home</Link>
        <Link href="/debates" className={linkClass("/debates")}>Debates</Link>
        <Link href="/settings" className={linkClass("/settings")}>Settings</Link>
        <div className="ml-auto flex gap-2">
          {user ? (
            <button onClick={logout} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300">Logout</button>
          ) : (
            <>
              <Link href="/auth/login" className="px-3 py-1 rounded border border-gray-300 text-black hover:bg-gray-100">Sign in</Link>
              <Link href="/auth/sign-up" className="px-3 py-1 rounded bg-black text-white hover:bg-gray-800">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
