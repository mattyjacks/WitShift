'use client';

import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense, useState } from "react";
import { createClient } from "@/lib/supabase/client";

function ResendCard() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setIsLoading(true);
    setMessage(null);
    setError(null);
    const supabase = createClient();
    try {
      // Attempt to resend confirmation email.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore – resend is not yet in types but available at runtime for supabase-js v2
      const { error: resendError } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `https://witshift.vercel.app/protected`,
        },
      });
      if (resendError) throw resendError;
      setMessage("Confirmation email sent. Please check your inbox.");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        return;
      }
      setError("Failed to resend confirmation email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
        <CardDescription>Check your email to confirm</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          We sent a confirmation link to <span className="font-medium">{email}</span>.
          Click the link in that email to confirm your account before signing in.
        </p>
        {message && (
          <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        <Button
          type="button"
          onClick={handleResend}
          disabled={isLoading || !email}
        >
          {isLoading ? "Sending..." : "Resend Confirmation Email"}
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Suspense>
            <ResendCard />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
