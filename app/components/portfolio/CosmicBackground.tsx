"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { THREAD_COLORS, type AudioMetricsRef } from "./types";
import styles from "./portfolio.module.css";

type Star = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  phase: number;
};

export default function CosmicBackground({
  audioMetricsRef,
}: {
  audioMetricsRef: AudioMetricsRef;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let width = 0,
      height = 0,
      frame = 0,
      last = 0;
    let stars: Star[] = [];
    const mouse = { x: -1000, y: -1000, active: false };
    let ripple: { x: number; y: number; time: number } | null = null;
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, width < 768 ? 1.5 : 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      stars = Array.from({ length: width < 768 ? 45 : 95 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: 0.4 + Math.random(),
        alpha: 0.15 + Math.random() * 0.35,
        phase: Math.random() * Math.PI * 2,
      }));
      if (reduced) draw(0);
    };
    function draw(time: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);
      const ambient = ctx.createRadialGradient(
        width * 0.5,
        height * 0.45,
        0,
        width * 0.5,
        height * 0.45,
        Math.max(width, height) * 0.8,
      );
      ambient.addColorStop(0, "#0b172b");
      ambient.addColorStop(0.6, "#030710");
      ambient.addColorStop(1, "#010206");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, width, height);
      for (const star of stars) {
        const alpha = reduced
          ? star.alpha
          : Math.max(
              0.05,
              star.alpha + Math.sin(time * 0.0005 + star.phase) * 0.1,
            );
        ctx.fillStyle = `rgba(210,229,255,${alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      THREAD_COLORS.forEach((color, i) => {
        const baseX = (width * (i + 1)) / 7;
        const audio = audioMetricsRef.current;
        const energy = reduced ? 0 : audio.playing ? (audio.bands[i] ?? 0) : 0;
        const pointX = (y: number) => {
          if (reduced) return baseX;
          let offset =
            Math.sin(y * 0.004 + time * 0.0003 + i) * (3 + energy * 30);
          if (mouse.active) {
            const force = Math.exp(
              -Math.pow((mouse.x - baseX) / 180, 2) -
                Math.pow((mouse.y - y) / 220, 2),
            );
            offset +=
              force * (mouse.x - baseX) * 0.14 +
              Math.sin(y * 0.025 - time * 0.003) * force * 14;
          }
          if (ripple) {
            const age = time - ripple.time;
            const amplitude =
              Math.max(0, 1 - age / 1200) *
              Math.exp(-Math.pow((ripple.x - baseX) / 260, 2));
            offset +=
              Math.sin((y - ripple.y) * 0.035 - age * 0.014) * amplitude * 24;
          }
          return baseX + offset;
        };
        ctx.beginPath();
        for (let y = 0; y <= height + 12; y += 12) {
          const x = pointX(y);
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color + "45";
        ctx.lineWidth = 1;
        ctx.shadowColor = color;
        ctx.shadowBlur = 5 + energy * 12;
        ctx.stroke();
        ctx.shadowBlur = 0;
        for (let n = 0; n < 3; n++) {
          const y = reduced
            ? (height * (n + 1)) / 4
            : (time * (0.013 + energy * 0.025) +
                (height * (n + i * 0.15)) / 3) %
              height;
          ctx.beginPath();
          ctx.arc(pointX(y), y, 1.6 + energy, 0, Math.PI * 2);
          ctx.fillStyle = color + "b0";
          ctx.shadowColor = color;
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });
    }
    const tick = (time: number) => {
      if (document.hidden) return;
      // 45 fps on desktop; 30 fps on mobile, without coupling speed to frame rate.
      if (time - last >= (width < 768 ? 32 : 21)) {
        draw(time);
        last = time;
      }
      if (!reduced) frame = requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "mouse") {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        mouse.active = true;
      }
    };
    const leave = () => {
      mouse.active = false;
    };
    const click = (event: PointerEvent) => {
      ripple = { x: event.clientX, y: event.clientY, time: performance.now() };
    };
    const visibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduced) frame = requestAnimationFrame(tick);
    };
    resize();
    if (!reduced) frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    if (!reduced) {
      window.addEventListener("pointermove", move, { passive: true });
      window.addEventListener("pointerdown", click, { passive: true });
      document.addEventListener("pointerleave", leave);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", click);
      document.removeEventListener("pointerleave", leave);
    };
  }, [audioMetricsRef, reduced]);
  return (
    <div className={styles.cosmos} aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className={styles.vignette} />
    </div>
  );
}
