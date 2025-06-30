import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import NavBar from "@/components/nav-bar";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "WitShift: Debate Arena!",
  description: "WitShift is a turn-based, voice-first debate arena where every move locks you out for an hour—think before you speak.",
  openGraph: {
    title: "WitShift: Debate Arena!",
    description: "Join the time-pressured voice debate arena. Make your point, then wait an hour— quality over quantity.",
    url: defaultUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "WitShift: Debate Arena!",
    description: "Turn-based voice debates with a 60-minute cooldown. Join the discourse on WitShift.",
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
