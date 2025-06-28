"use client";
import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

export default function VoiceAvatar({ src, audioRef }: { src: string; audioRef: React.RefObject<HTMLAudioElement>; }) {
  const controls = useAnimation();
  const analyserRef = useRef<AnalyserNode | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    const ctx = new AudioContext();
    const srcNode = ctx.createMediaElementSource(audioRef.current);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    srcNode.connect(analyser);
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;

    const data = new Uint8Array(analyser.frequencyBinCount);
    function tick() {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((a, b) => a + b, 0) / data.length;
      const scale = 1 + avg / 256;
      controls.start({ scale, boxShadow: `0 0 ${avg / 10}px rgba(59,130,246,0.6)` });
      requestAnimationFrame(tick);
    }
    tick();
    return () => {
      analyser.disconnect();
      srcNode.disconnect();
      ctx.close();
    };
  }, [audioRef]);

  return (
    <motion.img
      initial={{ scale: 1 }}
      animate={controls}
      src={src}
      alt="avatar"
      className="w-10 h-10 rounded-full object-cover"
    />
  );
}
