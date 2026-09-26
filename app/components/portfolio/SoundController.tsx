"use client";

import { useEffect, useRef, useState } from "react";
import type { AudioMetricsRef } from "./types";
import styles from "./portfolio.module.css";

type Graph = {
  context: AudioContext;
  analyser: AnalyserNode;
  source: MediaElementAudioSourceNode;
};

export default function SoundController({
  audioMetricsRef,
}: {
  audioMetricsRef: AudioMetricsRef;
}) {
  const element = useRef<HTMLAudioElement>(null);
  const graph = useRef<Graph | null>(null);
  const [playing, setPlaying] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      graph.current?.source.disconnect();
      if (graph.current?.context.state !== "closed")
        void graph.current?.context.close();
      graph.current = null;
    };
  }, []);

  useEffect(() => {
    const analyser = graph.current?.analyser;
    audioMetricsRef.current.playing = playing;
    if (!playing || !analyser) {
      audioMetricsRef.current.level = 0;
      audioMetricsRef.current.bass = 0;
      audioMetricsRef.current.bands.fill(0);
      audioMetricsRef.current.pulses.fill(0);
      return;
    }
    let frame = 0;
    const bins = new Uint8Array(analyser.frequencyBinCount);
    const update = () => {
      analyser.getByteFrequencyData(bins);
      const bands = [0, 3, 8, 18, 40, 80, 128];
      for (let i = 0; i < 6; i++) {
        let sum = 0;
        for (let j = bands[i]; j < bands[i + 1]; j++) sum += bins[j];
        const value = sum / ((bands[i + 1] - bands[i]) * 255);
        const old = audioMetricsRef.current.bands[i];
        audioMetricsRef.current.bands[i] = value;
        audioMetricsRef.current.pulses[i] = Math.max(0, value - old) * 4;
      }
      audioMetricsRef.current.bass = audioMetricsRef.current.bands[0];
      audioMetricsRef.current.level =
        audioMetricsRef.current.bands.reduce((a, b) => a + b, 0) / 6;
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
      audioMetricsRef.current.playing = false;
    };
  }, [playing, audioMetricsRef]);

  async function toggle() {
    const audio = element.current;
    if (!audio || busy) return;
    if (playing) {
      audio.pause();
      return;
    }
    setBusy(true);
    setError("");
    try {
      if (!graph.current) {
        const context = new AudioContext();
        const analyser = context.createAnalyser();
        analyser.fftSize = 256;
        const source = context.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(context.destination);
        graph.current = { context, analyser, source };
      }
      await graph.current.context.resume();
      audio.volume = 0.35;
      await audio.play();
    } catch {
      if (alive.current)
        setError("Audio belum dapat diputar. Periksa file universe.mp3.");
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return (
    <div className={styles.soundDock}>
      <audio
        ref={element}
        src="/music/universe.mp3"
        preload="none"
        loop
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setError("Audio belum tersedia: public/music/universe.mp3");
          setPlaying(false);
        }}
      />
      {error && (
        <p role="status" className={styles.soundError}>
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        aria-pressed={playing}
        aria-label={playing ? "Matikan musik" : "Nyalakan musik"}
      >
        <span
          className={styles.equalizer}
          data-playing={playing}
          aria-hidden="true"
        >
          {[0, 1, 2, 3].map((i) => (
            <i key={i} style={{ animationDelay: `${i * -0.17}s` }} />
          ))}
        </span>
        <span>{busy ? "Loading" : playing ? "Sound on" : "Sound off"}</span>
      </button>
    </div>
  );
}
