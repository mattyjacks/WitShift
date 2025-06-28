"use client";
import { useState, useRef, useEffect } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

interface Props {
  onRecorded: (url: string) => void;
}

export default function VoiceRecorder({ onRecorded }: Props) {
  const MAX_DURATION_MS = 5 * 60 * 1000; // 5 minutes
  const [timeLeft, setTimeLeft] = useState<number>(MAX_DURATION_MS);
  const timerRef = useRef<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const {
    status,
    startRecording: rawStartRecording,
    stopRecording: rawStopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  useEffect(() => {
    if (mediaBlobUrl) {
      fetch(mediaBlobUrl)
        .then(res => res.blob())
        .then(blob => {
          setRecordedUrl(mediaBlobUrl);
          setRecordedBlob(blob);
        });
    } else {
      setRecordedUrl(null);
      setRecordedBlob(null);
    }
  }, [mediaBlobUrl]);

  useEffect(() => {
    if (status === "recording") {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1000) {
            rawStopRecording();
            return 0;
          }
          return prev - 1000;
        });
      }, 1000);
    } else {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [status]);

  // Proxy startRecording to reset timer
  function startRecording() {
    setTimeLeft(MAX_DURATION_MS);
    rawStartRecording();
  }
  function stopRecording() {
    rawStopRecording();
  }

  async function handleUpload() {
    if (!recordedBlob) return;
    setUploading(true);
    const response = await fetch("/api/upload", {
      method: "POST",
      body: recordedBlob,
      headers: { "Content-Type": "audio/webm" },
    });
    const json = await response.json().catch(() => ({}));
    setUploading(false);
    if (json.url) {
      onRecorded(json.url);
    } else {
      alert("Upload failed");
    }
  }

  return (
    <div className="flex flex-col gap-2 items-start">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={status === "recording" ? stopRecording : startRecording}
          className="px-3 py-1 rounded text-white"
          style={{ backgroundColor: status === "recording" ? "#dc2626" : "#1e40af" }}
        >
          {status === "recording" ? "Stop" : "Record"}
        </button>
        {recordedUrl && (
          <button
            type="button"
            onClick={handleUpload}
            className="px-3 py-1 rounded bg-green-700 text-white disabled:opacity-50"
            disabled={uploading}
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        )}
        {recordedUrl && (
          <button
            type="button"
            onClick={() => {
              setRecordedUrl(null);
              setRecordedBlob(null);
            }}
            className="px-3 py-1 rounded bg-gray-300 text-black"
          >
            Discard
          </button>
        )}
        {status === "recording" && (
          <span className="text-xs text-gray-600 ml-2">
            {Math.floor(timeLeft / 60000)}:{String(Math.floor((timeLeft % 60000) / 1000)).padStart(2, '0')} left
          </span>
        )}
      </div>
      {recordedUrl && (
        <audio controls src={recordedUrl} className="w-full mt-2" />
      )}
    </div>
  );
}
