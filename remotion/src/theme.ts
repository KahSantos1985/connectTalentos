import { loadFont as loadDisplay } from "@remotion/google-fonts/Sora";
import { loadFont as loadBody } from "@remotion/google-fonts/Inter";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const display = loadDisplay("normal", { weights: ["600", "800"], subsets: ["latin"] }).fontFamily;
export const body = loadBody("normal", { weights: ["400", "500", "600"], subsets: ["latin"] }).fontFamily;
export const mono = loadMono("normal", { weights: ["400", "500"], subsets: ["latin"] }).fontFamily;

export const colors = {
  bg: "#0a0f1c",
  bgWarm: "#1a1410",
  surface: "#121a2e",
  primary: "#3b82f6",     // brand blue
  primaryGlow: "#60a5fa",
  accent: "#22d3ee",       // cyan
  warm: "#f59e0b",         // amber for "cotidiano"
  green: "#10b981",
  text: "#e8edf5",
  muted: "#94a3b8",
};
