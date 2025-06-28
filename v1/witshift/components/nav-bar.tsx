"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const linkClass = (href: string) =>
    `px-3 py-2 rounded hover:bg-gray-200 ${pathname === href ? "font-semibold" : ""}`;

  return (
    <nav className="w-full border-b mb-6">
      <div className="max-w-5xl mx-auto px-4 flex items-center h-12 gap-4">
        <Link href="/" className={linkClass("/")}>Home</Link>
        <Link href="/debates" className={linkClass("/debates")}>Debates</Link>
        <Link href="/settings" className={linkClass("/settings")}>Settings</Link>
      </div>
    </nav>
  );
}
