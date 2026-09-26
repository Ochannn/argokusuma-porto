"use client";

import {
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

import styles from "./portfolio.module.css";

const statement =
  "Ideas become useful when every part connects. I build web applications that bring interfaces, data, and automation together. From the first line of code to the final interaction, every detail has a purpose.";

const words = statement.split(" ");

function Word({
  word,
  index,
  progress,
  extent,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
  extent: number;
}) {
  const angle = index * 2.39996;

  const distance =
    (0.5 + (index % 5) * 0.13) * extent;

  const x = useTransform(
    progress,
    [0, 1],
    [Math.cos(angle) * distance, 0]
  );

  const y = useTransform(
    progress,
    [0, 1],
    [Math.sin(angle) * distance * 0.75, 0]
  );

  const rotate = useTransform(
    progress,
    [0, 1],
    [((index % 7) - 3) * 6, 0]
  );

  const opacity = useTransform(
    progress,
    [0, 0.65, 1],
    [0.12 + (index % 4) * 0.1, 0.75, 1]
  );

  const scale = useTransform(
    progress,
    [0, 1],
    [0.85, 1]
  );

  return (
    <motion.span
      aria-hidden="true"
      className={styles.storyWord}
      style={{
        x,
        y,
        rotate,
        opacity,
        scale,
      }}
    >
      {word}{" "}
    </motion.span>
  );
}

export default function StorySection({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();

  /*
   * Penting:
   * jangan render MotionValue words ketika SSR.
   */
  const [mounted, setMounted] = useState(false);

  const content = useRef<HTMLDivElement>(null);

  const [extent, setExtent] = useState(200);
  const [fits, setFits] = useState(true);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const assembled = useTransform(
    scrollYProgress,
    [0, 0.42],
    [0, 1]
  );

  const progress = useSpring(assembled, {
    stiffness: 100,
    damping: 28,
    mass: 0.65,
  });

  const lineScale = useTransform(
    progress,
    [0.4, 1],
    [0.05, 1]
  );

  const closingOpacity = useTransform(
    progress,
    [0.75, 1],
    [0, 1]
  );

  /*
   * Browser sudah selesai hydration.
   */
  useEffect(() => {
    setMounted(true);
  }, []);

  /*
   * Measurement hanya berjalan di browser.
   */
  useEffect(() => {
    const measure = () => {
      setExtent(
        Math.min(
          window.innerWidth * 0.23,
          300
        )
      );

      setFits(
        (content.current?.scrollHeight ?? 0) + 204 <
          window.innerHeight
      );
    };

    measure();

    const observer = new ResizeObserver(measure);

    if (content.current) {
      observer.observe(content.current);
    }

    window.addEventListener(
      "resize",
      measure,
      { passive: true }
    );

    return () => {
      observer.disconnect();

      window.removeEventListener(
        "resize",
        measure
      );
    };
  }, []);

  /*
   * Server        -> static
   * Initial client -> static
   * Setelah mount -> animated
   */
  const staticLayout =
    !mounted || !!reduced || !fits;

  return (
    <section
      ref={sectionRef}
      id="about"
      className={styles.storyTrack}
      data-static={staticLayout}
      aria-labelledby="story-label"
    >
      <div className={styles.storyPanel}>
        <div
          className={styles.storyGlow}
          aria-hidden="true"
        />

        <div className={styles.sceneTop}>
          <span>02 / THE CONNECTION</span>
          <span>IDEA → SYSTEM</span>
        </div>

        <div
          className={styles.storyContent}
          ref={content}
        >
          <h2
            className={styles.eyebrow}
            id="story-label"
          >
            Nothing works in isolation.
          </h2>

          <p
            className={styles.storyText}
            aria-label={statement}
          >
            {staticLayout
              ? statement
              : words.map((word, index) => (
                  <Word
                    key={`${word}-${index}`}
                    word={word}
                    index={index}
                    progress={progress}
                    extent={extent}
                  />
                ))}
          </p>

          <motion.div
            className={styles.storyRule}
            aria-hidden="true"
            style={
              staticLayout
                ? undefined
                : { scaleX: lineScale }
            }
          />

          <motion.p
            className={styles.storyClosing}
            style={
              staticLayout
                ? undefined
                : {
                    opacity: closingOpacity,
                  }
            }
          >
            Every detail. One connected experience.
          </motion.p>
        </div>

        <div className={styles.sceneBottom}>
          <span>
            Web development / Data / Automation
          </span>

          <a href="#projects">
            Explore the work ↓
          </a>
        </div>
      </div>
    </section>
  );
}