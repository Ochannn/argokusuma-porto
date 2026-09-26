export type AudioMetrics = {
  level: number;
  bass: number;
  playing: boolean;
  bands: number[];
  pulses: number[];
};

export type AudioMetricsRef = { current: AudioMetrics };

export const THREAD_COLORS = [
  "#3b82f6",
  "#facc15",
  "#ef4444",
  "#a855f7",
  "#22c55e",
  "#f97316",
] as const;
