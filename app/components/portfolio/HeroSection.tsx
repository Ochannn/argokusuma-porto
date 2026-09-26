"use client";

import { motion, useReducedMotion, type MotionValue } from "motion/react";
import styles from "./portfolio.module.css";

type Props = {
  ready: boolean;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
};
const ease = [0.22, 1, 0.36, 1] as const;

export default function HeroSection({ ready, scale, opacity }: Props) {
  const reduced = useReducedMotion();
  return (
    <section id="home" className={styles.hero} aria-labelledby="hero-heading">
      <motion.div
        className={styles.heroScene}
        style={reduced ? undefined : { scale, opacity }}
      >
        <motion.header
          className={styles.header}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <a className={styles.identity} href="#home">
            <span className={styles.monogram}>
              AK<span>✦</span>
            </span>
            <span>
              Argo Kusuma<small>Full-Stack Developer</small>
            </span>
          </a>
          <nav aria-label="Navigasi utama">
            <a href="#about">About</a>
            <a href="#projects">
              Work <span>↗</span>
            </a>
          </nav>
        </motion.header>
        <div className={styles.heroCenter}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            Personal universe / 2026
          </motion.p>
          <h1 id="hero-heading" className={styles.heroTitle}>
            <span className={styles.lineMask}>
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: ready ? 0 : "110%" }}
                transition={{ delay: 0.35, duration: reduced ? 0 : 1.2, ease }}
              >
                CODE MEETS
              </motion.span>
            </span>
            <span className={styles.lineMask}>
              <motion.span
                className={styles.heroOutline}
                initial={{ y: "110%" }}
                animate={{ y: ready ? 0 : "110%" }}
                transition={{ delay: 0.5, duration: reduced ? 0 : 1.2, ease }}
              >
                THE UNIVERSE<span className={styles.titleDot}>.</span>
              </motion.span>
            </span>
          </h1>
          <motion.div
            className={styles.heroCaption}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 16 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <p>Turning ideas into working systems.</p>
            <span>Web · Data · Automation · Analysis</span>
            <a className={styles.heroCta} href="#projects">
              Explore selected work <span>↗</span>
            </a>
          </motion.div>
        </div>
        <motion.div
          className={styles.heroBottom}
          initial={{ opacity: 0 }}
          animate={{ opacity: ready ? 1 : 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
        >
          <span className={styles.heroCoordinates}>
            EXPLORE / CREATE / EVOLVE
          </span>
          <a href="#about" className={styles.scrollCue}>
            <span>Scroll to connect</span>
            <i aria-hidden="true" />
          </a>
          <span className={styles.heroCoordinates}>01 — ORIGIN</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
