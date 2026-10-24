import type React from "react";
import { Easing, useCurrentFrame } from "remotion";
import { colors, headline } from "../theme";
import { FlickerReveal } from "./FlickerReveal";
import { ip } from "./util";

// A solid word with outlined copies above and below that slide apart and fade
export const EchoStack: React.FC<{
  word: string;
  fontSize: number;
  start?: number;
  // frames the echoes take to slide apart
  spread?: number;
  echoColor?: string;
  echoes?: number;
  flicker?: boolean;
  outStart?: number;
  style?: React.CSSProperties;
  seed?: string;
  // "behind": echoes fade out as they separate; "hold": they stay
  mode?: "fade" | "hold";
  letterSpacing?: string;
  // gap between rows as fraction of fontSize at rest / at full spread
  gap?: [number, number];
}> = ({
  word,
  fontSize,
  start = 0,
  spread = 14,
  echoColor = "rgba(185,163,255,0.35)",
  echoes = 1,
  flicker = true,
  outStart,
  style,
  seed = word,
  mode = "fade",
  letterSpacing,
  gap = [0.95, 1.15],
}) => {
  const f = useCurrentFrame() - start;
  const t = ip(f, [0, spread], [0, 1], Easing.out(Easing.cubic));
  const d = fontSize * (gap[0] + (gap[1] - gap[0]) * t);
  const echoOpacity =
    mode === "fade"
      ? ip(f, [0, 3, spread * 0.6, spread * 1.6], [0, 1, 0.9, 0.35])
      : ip(f, [0, 3], [0, 1]);
  const base: React.CSSProperties = {
    ...headline,
    fontSize,
    letterSpacing: letterSpacing ?? headline.letterSpacing,
  };
  const echoRows = [];
  for (let k = 1; k <= echoes; k++) {
    for (const s of [-1, 1]) {
      echoRows.push(
        <div
          key={`${k}${s}`}
          style={{
            ...base,
            position: "absolute",
            left: 0,
            right: 0,
            textAlign: "center",
            top: s * d * k,
            color: "transparent",
            WebkitTextStroke: `1.5px ${echoColor}`,
            opacity: echoOpacity / k,
          }}
        >
          {word}
        </div>,
      );
    }
  }
  return (
    <div style={{ position: "relative", textAlign: "center", ...style }}>
      {echoRows}
      <div style={{ position: "relative" }}>
        {flicker ? (
          <FlickerReveal
            text={word}
            start={start}
            window={7}
            outStart={outStart}
            seed={seed}
            style={{ ...base, color: colors.white }}
          />
        ) : (
          <span style={base}>{word}</span>
        )}
      </div>
    </div>
  );
};
