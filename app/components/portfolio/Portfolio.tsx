"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  MotionConfig,
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

import { createPortal } from "react-dom";

import {
  FaLinkedinIn,
  FaInstagram,
  FaTiktok,
  FaThreads,
} from "react-icons/fa6";

import "lenis/dist/lenis.css";

import IntroLoader from "./IntroLoader";
import HeroSection from "./HeroSection";
import StorySection from "./StorySection";
import ProjectsSection from "./ProjectsSection";
import CosmicBackground from "./CosmicBackground";
import SoundController from "./SoundController";
import CustomCursor from "./CustomCursor";

import { useSmoothScroll } from "./useSmoothScroll";

import type { AudioMetrics } from "./types";

import styles from "./portfolio.module.css";

/* =========================================================
   TYPES
========================================================= */

type Phase = "intro" | "reveal" | "ready";

/* =========================================================
   SOCIAL MEDIA
========================================================= */

const socials = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/argo-kusuma-4152132aa/",
    icon: FaLinkedinIn,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/arrgoo_",
    icon: FaInstagram,
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@chaafnk",
    icon: FaTiktok,
  },
  {
    name: "Threads",
    href: "https://www.threads.net/@ochaseledri",
    icon: FaThreads,
  },
];

/* =========================================================
   PORTFOLIO
========================================================= */

export default function Portfolio() {
  /* =======================================================
     STATE
  ======================================================= */

  const [phase, setPhase] =
    useState<Phase>("intro");

  const [mounted, setMounted] =
    useState(false);

  /* =======================================================
     REFS
  ======================================================= */

  const mainRef =
    useRef<HTMLElement>(null);

  const storyRef =
    useRef<HTMLElement>(null);

  /* =======================================================
     AUDIO DATA
  ======================================================= */

  const audio =
    useRef<AudioMetrics>({
      level: 0,
      bass: 0,
      playing: false,

      bands: Array(6).fill(0),
      pulses: Array(6).fill(0),
    });

  /* =======================================================
     INTRO STATE
  ======================================================= */

  const locked =
    phase !== "ready";

  const beginReveal =
    useCallback(() => {
      setPhase("reveal");
    }, []);

  const finishIntro =
    useCallback(() => {
      setPhase("ready");
    }, []);

  /* =======================================================
     GLOBAL SCROLL PROGRESS
  ======================================================= */

  const {
    scrollYProgress,
  } = useScroll();

  const progress =
    useSpring(
      scrollYProgress,
      {
        stiffness: 160,
        damping: 32,
        mass: 0.4,
      },
    );

  /* =======================================================
     HERO → STORY TRANSITION
  ======================================================= */

  const {
    scrollYProgress: cover,
  } = useScroll({
    target: storyRef,

    offset: [
      "start end",
      "start start",
    ],
  });

  const heroScale =
    useTransform(
      cover,
      [0, 1],
      [1, 0.94],
    );

  const heroOpacity =
    useTransform(
      cover,
      [0, 1],
      [1, 0.3],
    );

  /* =======================================================
     SMOOTH SCROLL
  ======================================================= */

  const {
    scrollTo,
  } = useSmoothScroll(
    locked,
  );

  /* =======================================================
     CLIENT MOUNT
  ======================================================= */

  useEffect(() => {
    setMounted(true);
  }, []);

  /* =======================================================
     LOCK PAGE WHILE INTRO IS ACTIVE
  ======================================================= */

  useEffect(() => {
    const main =
      mainRef.current;

    /*
     * Prevent main content from being
     * interactive while intro is active.
     */
    if (locked) {
      main?.setAttribute(
        "inert",
        "",
      );
    } else {
      main?.removeAttribute(
        "inert",
      );
    }

    if (!locked) {
      return;
    }

    const previousOverflow =
      document.body.style
        .overflow;

    const previousRestoration =
      history.scrollRestoration;

    /*
     * Prevent browser from restoring an old
     * scroll position while intro is running.
     */
    history.scrollRestoration =
      "manual";

    /*
     * Lock native scrolling.
     */
    document.body.style.overflow =
      "hidden";

    /*
     * Intro always starts from top.
     */
    window.scrollTo(
      0,
      0,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      history.scrollRestoration =
        previousRestoration;

      main?.removeAttribute(
        "inert",
      );
    };
  }, [locked]);

  /* =======================================================
     BACK TO TOP
  ======================================================= */

  const handleBackToTop =
    useCallback(
      (
        event:
          React.MouseEvent<
            HTMLAnchorElement
          >,
      ) => {
        event.preventDefault();

        scrollTo(0);
      },
      [scrollTo],
    );

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <MotionConfig
      reducedMotion="user"
    >
      <div
        className={
          styles.portfolio
        }
      >
        {/* =================================
            CUSTOM CURSOR
        ================================= */}

        <CustomCursor />

        {/* =================================
            COSMIC BACKGROUND
        ================================= */}

        <CosmicBackground
          audioMetricsRef={
            audio
          }
        />

        {/* =================================
            SCROLL PROGRESS
        ================================= */}

        <motion.div
          className={
            styles.readProgress
          }
          style={{
            scaleX:
              progress,
          }}
          aria-hidden="true"
        />

        {/* =================================
            MAIN CONTENT
        ================================= */}

        <main
          ref={mainRef}
          className={
            styles.main
          }
        >
          {/* ===============================
              HERO
          =============================== */}

          <HeroSection
            ready={
              phase !==
              "intro"
            }
            scale={
              heroScale
            }
            opacity={
              heroOpacity
            }
          />

          {/* ===============================
              STORY / ABOUT
          =============================== */}

          <StorySection
            sectionRef={
              storyRef
            }
          />

          {/* ===============================
              PROJECTS
          =============================== */}

          <ProjectsSection />

          {/* ===============================
              FOOTER
          =============================== */}

          <footer
            className={
              styles.footer
            }
          >
            {/* decorative glow */}

            <div
              className={
                styles.footerGlow
              }
              aria-hidden="true"
            />

            {/* =============================
                FOOTER TOP
            ============================= */}

            <div
              className={
                styles.footerTop
              }
            >
              {/* BRAND */}

              <div
                className={
                  styles.footerBrand
                }
              >
                <a
                  className={
                    styles.wordmark
                  }
                  href="#home"
                  onClick={(
                    event,
                  ) => {
                    event.preventDefault();

                    scrollTo(
                      0,
                    );
                  }}
                >
                  ARGO

                  <span>
                    {" "}
                    /{" "}
                  </span>

                  KUSUMA
                </a>

                <p
                  className={
                    styles.footerDescription
                  }
                >
                  Building
                  thoughtful
                  digital
                  experiences
                  through code,
                  data, and
                  automation.
                </p>
              </div>

              {/* ===========================
                  SOCIAL MEDIA
              =========================== */}

              <div
                className={
                  styles.footerSocialArea
                }
              >
                <span
                  className={
                    styles.footerSocialLabel
                  }
                >
                  CONNECT
                  WITH ME
                </span>

                <div
                  className={
                    styles.footerSocials
                  }
                >
                  {socials.map(
                    (
                      social,
                    ) => {
                      const Icon =
                        social.icon;

                      return (
                        <motion.a
                          key={
                            social.name
                          }
                          href={
                            social.href
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={
                            social.name
                          }
                          title={
                            social.name
                          }
                          whileHover={{
                            y: -5,
                            scale:
                              1.08,
                          }}
                          whileTap={{
                            scale:
                              0.92,
                          }}
                        >
                          <Icon />
                        </motion.a>
                      );
                    },
                  )}
                </div>
              </div>
            </div>

            {/* =============================
                DIVIDER
            ============================= */}

            <div
              className={
                styles.footerLine
              }
              aria-hidden="true"
            />

            {/* =============================
                FOOTER BOTTOM
            ============================= */}

            <div
              className={
                styles.footerBottom
              }
            >
              <p
                className={
                  styles.footerCopyright
                }
              >
                © 2026 ·
                Designed
                &amp; built
                by{" "}

                <strong>
                  Argo Kusuma
                </strong>
              </p>

              <p
                className={
                  styles.footerQuote
                }
              >
                Code meets
                the universe.
              </p>

              {/* ===========================
                  BACK TO TOP
              =========================== */}

              <motion.a
                href="#home"
                className={
                  styles.backToTop
                }
                onClick={
                  handleBackToTop
                }
                whileHover={{
                  y: -2,
                }}
                whileTap={{
                  scale:
                    0.96,
                }}
              >
                <span>
                  Kembali ke
                  atas
                </span>

                <i
                  aria-hidden="true"
                >
                  ↑
                </i>
              </motion.a>
            </div>
          </footer>
        </main>

        {/* =================================
            SOUND CONTROLLER
        ================================= */}

        {phase ===
          "ready" && (
          <SoundController
            audioMetricsRef={
              audio
            }
          />
        )}

        {/* =================================
            INTRO LOADER
        ================================= */}

        {mounted &&
          locked &&
          createPortal(
            <IntroLoader
              onReveal={
                beginReveal
              }
              onComplete={
                finishIntro
              }
            />,
            document.body,
          )}
      </div>
    </MotionConfig>
  );
}