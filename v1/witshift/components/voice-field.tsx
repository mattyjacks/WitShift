"use client";
import { useState } from "react";
import VoiceRecorder from "./voice-recorder";

export default function VoiceField() {
  const [url, setUrl] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <VoiceRecorder onRecorded={setUrl} />
      <input type="hidden" name="audioUrl" value={url} />
    </div>
  );
}
