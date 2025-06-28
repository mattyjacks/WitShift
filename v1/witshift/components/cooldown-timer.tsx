"use client";
import { useEffect, useState } from "react";

export default function CooldownTimer({ unlockAt }: { unlockAt: string | null }) {
  if (!unlockAt) return null;
  const unlockDate = new Date(unlockAt);
  const [remaining, setRemaining] = useState(() => unlockDate.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(unlockDate.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [unlockAt]);

  if (remaining <= 0) return null;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return (
    <p className="text-sm text-red-600">
      Cooldown: {mins}:{secs.toString().padStart(2, "0")}
    </p>
  );
}
