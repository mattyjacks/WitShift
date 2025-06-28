"use client";
import { useState, useRef } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

interface Props {
  onRecorded: (url: string) => void;
}

export default function VoiceRecorder({ onRecorded }: Props) {
  const [uploading, setUploading] = useState(false);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  async function handleUpload(blobUrl: string) {
    setUploading(true);
    const res = await fetch(blobUrl);
    const blob = await res.blob();
    const form = new FormData();
    form.append("file", blob, "voice.webm");
    const response = await fetch("/api/upload", {
      method: "POST",
      body: form,
    });
    const json = await response.json();
    setUploading(false);
    if (json.url) {
      onRecorded(json.url);
    }
  }

  // When recording stops, mediaBlobUrl updates
  if (mediaBlobUrl && hiddenInputRef.current && !uploading) {
    handleUpload(mediaBlobUrl);
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={status === "recording" ? stopRecording : startRecording}
        className="px-3 py-1 rounded text-white"
        style={{ backgroundColor: status === "recording" ? "#dc2626" : "#1e40af" }}
      >
        {status === "recording" ? "Stop" : "Record"}
      </button>
      {uploading && <span className="text-xs">Uploading…</span>}
      <input type="hidden" ref={hiddenInputRef} />
    </div>
  );
}
