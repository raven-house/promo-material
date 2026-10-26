import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors, headline, outlineText } from "../theme";
import { range, rnd, rr } from "./util";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$/<>=*+";

export type GlitchTextProps = {
  text: string;
  // total frames this word is on screen (local frame 0 = first frame)
  dur: number;
  inFrames?: number;
  outFrames?: number;
  intensity?: number;
  seed?: string;
  style?: React.CSSProperties;
  // spans (start,end char index) drawn in lavender
  highlight?: [number, number][];
  bars?: boolean;
};

// Per-frame glitch amount 0..1 for an in/out window
export const glitchAmount = (
  f: number,
  dur: number,
  inFrames: number,
  outFrames: number,
) => {
  const gIn = inFrames > 0 && f < inFrames ? 1 - f / inFrames : 0;
  const outStart = dur - outFrames;
  const gOut =
    outFrames > 0 && f >= outStart ? (f - outStart + 1) / outFrames : 0;
  return Math.min(1, Math.max(gIn, gOut));
};

export const GlitchText: React.FC<GlitchTextProps> = ({
  text,
  dur,
  inFrames = 8,
  outFrames = 6,
  intensity = 1,
  seed = text,
  style,
  highlight = [],
  bars = true,
}) => {
  const f = useCurrentFrame();
  if (f < 0 || f >= dur) return null;
  const g = glitchAmount(f, dur, inFrames, outFrames) * intensity;
  const step = Math.floor(f / 2);
  const outStart = dur - outFrames;

  const chars = text.split("").map((ch, i) => {
    const landsAt = rnd(`${seed}-in-${i}`) * inFrames * 0.9;
    const leavesAt = outStart + rnd(`${seed}-out-${i}`) * outFrames * 0.9;
    const resolved = f >= landsAt && (outFrames === 0 || f < leavesAt);
    const lit = highlight.some(([a, b]) => i >= a && i < b);
    if (ch === " " || resolved) return { ch, mode: "solid" as const, lit };
    const r = rnd(`${seed}-st-${i}-${step}`);
    if (r < 0.3) return { ch, mode: "hidden" as const, lit };
    const glyph =
      r < 0.6
        ? ch
        : ALPHABET[
            Math.floor(rnd(`${seed}-gl-${i}-${step}`) * ALPHABET.length)
          ];
    return {
      ch: glyph,
      mode: r < 0.8 ? ("outline" as const) : ("dim" as const),
      lit,
    };
  });

  const base: React.CSSProperties = { ...headline, ...style };

  const renderLine = (color: string | null, extra?: React.CSSProperties) => (
    <span style={{ ...base, display: "inline-block", ...extra }}>
      {chars.map((c, i) => {
        const s: React.CSSProperties = {
          display: "inline-block",
          whiteSpace: "pre",
        };
        if (c.mode === "hidden") s.opacity = 0;
        if (c.mode === "outline") Object.assign(s, outlineText);
        if (c.mode === "dim") s.color = colors.dim;
        if (c.mode === "solid")
          s.color = color ?? (c.lit ? colors.lavender : base.color);
        if (color && c.mode !== "solid") s.color = color;
        return (
          <span key={i} style={s}>
            {c.ch}
          </span>
        );
      })}
    </span>
  );

  const off = (4 + 6 * g) * g;
  const slices =
    g > 0.05 ? range(2 + Math.floor(rnd(`${seed}-n-${step}`) * 3)) : [];

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      {g > 0.02 && (
        <>
          <span
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${-off}px)`,
              opacity: 0.85 * Math.min(1, g * 2),
              mixBlendMode: "screen",
            }}
          >
            {renderLine(colors.cyan)}
          </span>
          <span
            style={{
              position: "absolute",
              inset: 0,
              transform: `translateX(${off}px)`,
              opacity: 0.85 * Math.min(1, g * 2),
              mixBlendMode: "screen",
            }}
          >
            {renderLine(colors.magenta)}
          </span>
        </>
      )}
      {renderLine(
        null,
        slices.length ? { clipPath: "inset(0 0 0 0)" } : undefined,
      )}
      {slices.map((k) => {
        const top = rr(`${seed}-st-${k}-${step}`, 0, 85);
        const h = rr(`${seed}-sh-${k}-${step}`, 6, 22);
        const dx = (rnd(`${seed}-sx-${k}-${step}`) - 0.5) * 60 * g;
        return (
          <span
            key={k}
            style={{
              position: "absolute",
              inset: 0,
              clipPath: `inset(${top}% 0 ${Math.max(0, 100 - top - h)}% 0)`,
              transform: `translateX(${dx}px)`,
            }}
          >
            {renderLine(null)}
          </span>
        );
      })}
      {bars &&
        g > 0.05 &&
        range(3).map((k) => {
          const show = rnd(`${seed}-bs-${k}-${step}`) < 0.75;
          if (!show) return null;
          const fs = Number(base.fontSize ?? 100);
          return (
            <span
              key={`b${k}`}
              style={{
                position: "absolute",
                left: `${rr(`${seed}-bx-${k}-${step}`, -15, 95)}%`,
                top: `${rr(`${seed}-by-${k}-${step}`, -25, 115)}%`,
                width: rr(`${seed}-bw-${k}-${step}`, fs * 0.3, fs * 1.1),
                height: Math.max(3, fs * 0.04),
                borderRadius: 4,
                background: [colors.cyan, colors.magenta, "#3D7BFF"][k],
                boxShadow: `0 0 8px ${[colors.cyan, colors.magenta, "#3D7BFF"][k]}`,
              }}
            />
          );
        })}
    </span>
  );
};
