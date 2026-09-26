"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { THREAD_COLORS } from "./types";
import styles from "./portfolio.module.css";

type Props = { onReveal: () => void; onComplete: () => void };
const ease = [0.76, 0, 0.24, 1] as const;

export default function IntroLoader({ onReveal, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const reduced = useReducedMotion();
  const exitStarted = useRef(false);
  const finished = useRef(false);
  const beginExit = useCallback(() => {
    if (exitStarted.current) return;
    exitStarted.current = true;
    setProgress(100);
    onReveal();
    setExiting(true);
  }, [onReveal]);

  useEffect(() => {
    let frame = 0;
    const start = performance.now();
    const duration = reduced ? 300 : 3200;
    const tick = (now: number) => {
      if (exitStarted.current) return;
      const t = Math.min(1, (now - start) / duration);
      setProgress(Math.floor((1 - Math.pow(1 - t, 2)) * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const timer = window.setTimeout(beginExit, duration + (reduced ? 50 : 700));
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [beginExit, reduced]);

  return (
    <motion.div
      className={styles.intro}
      role="region"
      aria-label="Intro portfolio Argo Kusuma"
      initial={false}
      animate={
        exiting
          ? reduced
            ? { opacity: 0 }
            : {
                scale: [1, 0.84, 0.84, 0.7],
                y: ["0%", "0%", "-3%", "-115%"],
                rotateX: [0, 0, 5, 10],
                borderRadius: [0, 32, 32, 32],
                opacity: [1, 1, 1, 0],
              }
          : { scale: 1, y: "0%", rotateX: 0, borderRadius: 0, opacity: 1 }
      }
      transition={{
        duration: reduced ? 0.2 : 1.65,
        times: [0, 0.34, 0.56, 1],
        ease,
      }}
      style={{ transformPerspective: 1800, transformOrigin: "50% 60%" }}
      onAnimationComplete={() => {
        if (exiting && !finished.current) {
          finished.current = true;
          onComplete();
        }
      }}
    >
      <div className={styles.introGrid} aria-hidden="true" />
      <div className={styles.introThreads} aria-hidden="true">
        {THREAD_COLORS.map((color, i) => (
          <motion.i
            key={color}
            style={{
              background: `linear-gradient(transparent,${color},transparent)`,
              left: `${((i + 1) * 100) / 7}%`,
            }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 0.38 }}
            transition={{ delay: i * 0.09, duration: reduced ? 0 : 1.6 }}
          />
        ))}
      </div>
      <header className={styles.introTop}>
        <span>ARGO KUSUMA</span>
        <span>PERSONAL UNIVERSE / 2026</span>
      </header>
      <div className={styles.introCenter}>
        <div className={styles.orbits} aria-hidden="true">
          <i />
          <i />
          <i />
          <span>✦</span>
        </div>
        <p className={styles.eyebrow}>A new perspective</p>
        <h2>
          <span className={styles.lineMask}>
            <motion.span
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: reduced ? 0 : 1,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              EVERY IDEA
            </motion.span>
          </span>
          <span className={styles.lineMask}>
            <motion.span
              initial={{ y: "105%" }}
              animate={{ y: 0 }}
              transition={{
                duration: reduced ? 0 : 1,
                delay: 0.15,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              STARTS AS A <em>SPARK.</em>
            </motion.span>
          </span>
        </h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={progress < 45 ? "one" : progress < 85 ? "two" : "three"}
            className={styles.introStatus}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
          >
            {progress < 45
              ? "Connecting the dots"
              : progress < 85
                ? "Bringing ideas into focus"
                : "Welcome to my universe"}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className={styles.introBottom}>
        <div className={styles.introNumber} aria-hidden="true">
          {String(progress).padStart(2, "0")}
          <span>%</span>
        </div>
        <button type="button" onClick={beginExit} disabled={exiting}>
          Masuk ke portfolio <span>↗</span>
        </button>
      </div>
      <div className={styles.introTrack} aria-hidden="true">
        <motion.div style={{ scaleX: progress / 100 }} />
      </div>
    </motion.div>
  );
}
