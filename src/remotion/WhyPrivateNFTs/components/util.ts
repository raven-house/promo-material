import { fitText } from "@remotion/layout-utils";
import type { EasingFunction } from "remotion";
import { interpolate, random, useVideoConfig } from "remotion";
import { FONT } from "../theme";

export const clamp = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

export const ip = (
  f: number,
  input: number[],
  output: number[],
  easing?: EasingFunction,
) => interpolate(f, input, output, { ...clamp, easing });

export const range = (n: number) => Array.from({ length: n }, (_, i) => i);

export const rnd = (seed: string | number) => random(seed);

// Seeded value in [a, b)
export const rr = (seed: string | number, a: number, b: number) =>
  a + random(seed) * (b - a);

export const useLayout = () => {
  const { width, height } = useVideoConfig();
  const portrait = height > width;
  return { width, height, portrait, cx: width / 2, cy: height / 2 };
};

// Font size that keeps `text` inside `maxWidth`, capped at `base`
export const fitSize = (
  text: string,
  base: number,
  maxWidth: number,
  fontWeight: number = 800,
  letterSpacing = "0.02em",
) => {
  const { fontSize } = fitText({
    text,
    withinWidth: maxWidth,
    fontFamily: FONT,
    fontWeight,
    letterSpacing,
    textTransform: "uppercase",
    validateFontIsLoaded: false,
  });
  return Math.min(base, fontSize);
};

export const useFit = (
  text: string,
  base: number,
  fontWeight = 800,
  letterSpacing = "0.02em",
  widthFraction = 0.88,
) => {
  const { width } = useVideoConfig();
  return fitSize(text, base, width * widthFraction, fontWeight, letterSpacing);
};
