import { loadFont } from "@remotion/google-fonts/Inter";
import type React from "react";
import { springConfigs } from "../MyComp/RavenHouseVideo1/styles";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const FONT = fontFamily;

export const colors = {
  bg: "#0E0A22",
  bgCenter: "#1A1238",
  purple: "#7B5CF0",
  lavender: "#B9A3FF",
  raven: "#5F3C77",
  violet: "#6A3FD8",
  cyan: "#2EE6F0",
  magenta: "#FF2E86",
  white: "#FFFFFF",
  dim: "rgba(255,255,255,0.18)",
  outline: "rgba(185,163,255,0.35)",
  green: "#4ADE80",
};

export const GRADIENT =
  "linear-gradient(135deg, #2EE6F0 0%, #7B5CF0 55%, #6A3FD8 100%)";

export const BACKGROUND = `radial-gradient(ellipse at center, ${colors.bgCenter} 0%, ${colors.bg} 70%)`;

// Raven House app tokens (frontend-app globals.css + component classes)
export const ui = {
  bg: "hsl(252, 24%, 4%)",
  primary: "hsl(276, 33%, 35%)",
  primaryHover: "hsl(276, 33%, 42%)",
  card: "#1D1C1B",
  cardBorder: "#3A3A3A",
  panel: "#28242C",
  panelBorder: "#414141",
  input: "#201D23",
  listBtn: "#402D4E",
  gray700: "#374151",
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  text: "hsl(270, 20%, 96%)",
  muted: "#9F9F9F",
  green: "#16A34A",
  amber: "#FBBF24",
};

export const springs = {
  ...springConfigs,
  pop: { damping: 12, stiffness: 180 },
  whip: { damping: 30, stiffness: 300 },
};

// Headlines: ExtraBold, 0.02em tracking, uppercase
export const headline: React.CSSProperties = {
  fontFamily: FONT,
  fontWeight: 800,
  letterSpacing: "0.02em",
  textTransform: "uppercase",
  color: colors.white,
  lineHeight: 1,
  whiteSpace: "pre",
};

// Grid words: Bold, 0.18em tracking
export const gridWord: React.CSSProperties = {
  ...headline,
  fontWeight: 700,
  letterSpacing: "0.18em",
};

export const outlineText: React.CSSProperties = {
  color: "transparent",
  WebkitTextStroke: `1.5px ${colors.outline}`,
};

export const neonGlow = (color: string, strength = 1) =>
  `0 0 ${4 * strength}px ${color}, 0 0 ${12 * strength}px ${color}, 0 0 ${28 * strength}px ${color}`;
