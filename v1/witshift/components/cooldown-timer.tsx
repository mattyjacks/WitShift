"use client";
import { useEffect, useMemo, useState } from "react";

export default function CooldownTimer({ unlockAt }: { unlockAt: string | null }) {
  const unlockDate = useMemo(() => unlockAt ? new Date(unlockAt) : null, [unlockAt]);
  const [remaining, setRemaining] = useState(() =>
    unlockDate ? Math.max(unlockDate.getTime() - Date.now(), 0) : 0,
  );

  useEffect(() => {
    if (!unlockDate) return;
    const id = setInterval(() => {
      setRemaining(unlockDate.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [unlockAt, unlockDate]);

  if (!unlockDate || remaining <= 0) return null;
  const mins = Math.floor(remaining / 60000);
  const secs = Math.floor((remaining % 60000) / 1000);
  return (
    <p className="text-sm text-red-600">
      Cooldown: {mins}:{secs.toString().padStart(2, "0")}
    </p>
  );
}
