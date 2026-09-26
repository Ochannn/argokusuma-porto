"use client";

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import Lenis from "lenis";

import {
  useReducedMotion,
} from "motion/react";

export function useSmoothScroll(
  locked: boolean,
) {
  const lenisRef =
    useRef<Lenis | null>(
      null,
    );

  const frameRef =
    useRef<number | null>(
      null,
    );

  const reduced =
    useReducedMotion();

  /* =======================================================
     CREATE LENIS
  ======================================================= */

  useEffect(() => {
    /*
     * Respect accessibility preference.
     */
    if (reduced) {
      return;
    }

    const lenis =
      new Lenis({
        duration: 1.15,

        /*
         * Smooth mouse wheel.
         */
        smoothWheel: true,

        /*
         * Slightly softer wheel input.
         */
        wheelMultiplier:
          0.85,

        /*
         * Touch stays close to native.
         */
        touchMultiplier:
          1,

        infinite:
          false,
      });

    lenisRef.current =
      lenis;

    const raf = (
      time: number,
    ) => {
      lenis.raf(time);

      frameRef.current =
        requestAnimationFrame(
          raf,
        );
    };

    frameRef.current =
      requestAnimationFrame(
        raf,
      );

    return () => {
      if (
        frameRef.current !==
        null
      ) {
        cancelAnimationFrame(
          frameRef.current,
        );
      }

      lenis.destroy();

      lenisRef.current =
        null;
    };
  }, [reduced]);

  /* =======================================================
     LOCK / UNLOCK LENIS
  ======================================================= */

  useEffect(() => {
    const lenis =
      lenisRef.current;

    if (!lenis) {
      return;
    }

    if (locked) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [locked]);

  /* =======================================================
     SCROLL TO
  ======================================================= */

  const scrollTo =
    useCallback(
      (
        target:
          | number
          | string
          | HTMLElement,
      ) => {
        const lenis =
          lenisRef.current;

        /*
         * Main Lenis scrolling.
         */
        if (
          lenis &&
          !reduced
        ) {
          lenis.scrollTo(
            target,
            {
              duration:
                1.25,

              easing: (
                t: number,
              ) =>
                1 -
                Math.pow(
                  1 - t,
                  4,
                ),
            },
          );

          return;
        }

        /*
         * Fallback:
         * number
         */
        if (
          typeof target ===
          "number"
        ) {
          window.scrollTo({
            top: target,

            behavior:
              reduced
                ? "auto"
                : "smooth",
          });

          return;
        }

        /*
         * Fallback:
         * selector
         */
        if (
          typeof target ===
          "string"
        ) {
          const element =
            document.querySelector(
              target,
            );

          element?.scrollIntoView({
            behavior:
              reduced
                ? "auto"
                : "smooth",
          });

          return;
        }

        /*
         * Fallback:
         * HTMLElement
         */
        target.scrollIntoView({
          behavior:
            reduced
              ? "auto"
              : "smooth",
        });
      },
      [reduced],
    );

  return {
    scrollTo,
    lenisRef,
  };
}