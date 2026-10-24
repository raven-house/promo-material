import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors, headline, outlineText } from "../theme";
import { rnd } from "./util";

const WRONG = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export type FlickerRevealProps = {
  text: string;
  start?: number;
  window?: number;
  // frame at which letters start flickering out (omit to stay)
  outStart?: number;
  outWindow?: number;
  // substring(s) drawn in lavender, e.g. "GENERATION"
  highlight?: string | string[];
  seed?: string;
  style?: React.CSSProperties;
  // colour of a landed letter that is not highlighted
  color?: string;
  // render landed letters as outline instead of solid (for echo rows)
  ghost?: boolean;
};

const highlightMask = (text: string, highlight?: string | string[]) => {
  const mask = new Array(text.length).fill(false);
  const list = highlight
    ? Array.isArray(highlight)
      ? highlight
      : [highlight]
    : [];
  list.forEach((h) => {
    const at = text.indexOf(h);
    if (at >= 0) for (let i = at; i < at + h.length; i++) mask[i] = true;
  });
  return mask;
};

// State of one letter at frame f: "off" | "flicker" | "on"
export const letterState = (
  seed: string,
  i: number,
  f: number,
  start: number,
  window: number,
  outStart?: number,
  outWindow = 8,
) => {
  const landsAt = start + rnd(`${seed}-l-${i}`) * window;
  const showsAt = landsAt - 2 - rnd(`${seed}-s-${i}`) * 5;
  if (f < showsAt) return "off";
  if (outStart !== undefined) {
    const leavesAt = outStart + rnd(`${seed}-o-${i}`) * outWindow;
    if (f >= leavesAt + 3) return "off";
    if (f >= leavesAt) return "flicker";
  }
  return f < landsAt ? "flicker" : "on";
};

export const FlickerReveal: React.FC<FlickerRevealProps> = ({
  text,
  start = 0,
  window = 12,
  outStart,
  outWindow = 8,
  highlight,
  seed = text,
  style,
  color = colors.white,
  ghost = false,
}) => {
  const f = useCurrentFrame();
  const mask = highlightMask(text, highlight);
  return (
    <span style={{ ...headline, display: "inline-block", ...style }}>
      {text.split("").map((ch, i) => {
        if (ch === " ") return <span key={i}> </span>;
        const st = letterState(seed, i, f, start, window, outStart, outWindow);
        const s: React.CSSProperties = { display: "inline-block" };
        let glyph = ch;
        if (st === "off") s.opacity = 0;
        else if (st === "flicker") {
          const r = rnd(`${seed}-f-${i}-${Math.floor(f / 2)}`);
          if (r < 0.25) s.opacity = 0;
          else if (r < 0.75) Object.assign(s, outlineText);
          else {
            glyph =
              WRONG[Math.floor(rnd(`${seed}-w-${i}-${f}`) * WRONG.length)];
            s.color = colors.dim;
          }
        } else if (ghost) Object.assign(s, outlineText);
        else s.color = mask[i] ? colors.lavender : color;
        return (
          <span key={i} style={s}>
            {glyph}
          </span>
        );
      })}
    </span>
  );
};
