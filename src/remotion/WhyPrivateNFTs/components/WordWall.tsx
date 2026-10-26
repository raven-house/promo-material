import type React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { colors, headline } from "../theme";
import { FlickerReveal } from "./FlickerReveal";
import { ip, range, rnd, useLayout } from "./util";

const ROW_TINTS = [
  "rgba(255,46,134,0.45)",
  "rgba(46,230,240,0.38)",
  "rgba(140,110,255,0.55)",
  "rgba(185,163,255,0.42)",
];

// Full-frame rows of a repeated phrase. Alternate rows scroll opposite ways;
// `bright` centre rows are solid white with lavender highlights and letter flicker.
export const WordWall: React.FC<{
  phrase: string;
  highlight?: string | string[];
  // highlight used on alternating bright rows (reference swaps which half is lavender)
  highlightAlt?: string | string[];
  bright?: number;
  dur: number;
  fontSize?: number;
  seed?: string;
  // frame where the bright rows flicker out (defaults to dur - 8)
  outStart?: number;
}> = ({
  phrase,
  highlight,
  highlightAlt,
  bright = 2,
  dur,
  fontSize = 104,
  seed = phrase,
  outStart,
}) => {
  const f = useCurrentFrame();
  const { height, width, portrait } = useLayout();
  const fs = portrait ? fontSize * 0.72 : fontSize;
  const rowH = fs * 1.27;
  const rows = Math.ceil(height / rowH) + 2;
  const mid = Math.floor(rows / 2);
  const brightRows = range(bright).map((k) => mid - Math.floor(bright / 2) + k);
  const unit = `${phrase}   `;
  const repeats = Math.ceil((width * 2.5) / (unit.length * fs * 0.62)) + 1;

  // Enter on a tilted plane, settle, exit tilted the other way
  const enter = ip(f, [0, 14], [1, 0], Easing.out(Easing.cubic));
  const exit = ip(f, [dur - 7, dur], [0, 1], Easing.in(Easing.cubic));
  const ry = -38 * enter + 32 * exit;
  const rz = -6 * enter + 5 * exit;
  const sc = 1 + 0.35 * enter + 0.3 * exit;
  const dimIn = ip(f, [0, 14], [0.65, 1]);

  return (
    <AbsoluteFill style={{ perspective: 1400, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          transform: `rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
          justifyContent: "center",
        }}
      >
        {range(rows).map((r) => {
          const y = (r - mid) * rowH + height / 2 - rowH / 2;
          const isBright = brightRows.includes(r);
          const dir = r % 2 === 0 ? 1 : -1;
          const x =
            dir * (f * 3.2) - width * 0.6 - rnd(`${seed}-row-${r}`) * fs * 4;
          const tint = ROW_TINTS[r % ROW_TINTS.length];
          return (
            <div
              key={r}
              style={{
                position: "absolute",
                top: y,
                left: 0,
                width: "100%",
                height: rowH,
              }}
            >
              {!isBright && (
                <div
                  style={{
                    ...headline,
                    fontSize: fs,
                    position: "absolute",
                    left: x,
                    color: "transparent",
                    WebkitTextStroke: `1.5px ${tint}`,
                    opacity: dimIn,
                  }}
                >
                  {range(repeats)
                    .map(() => unit)
                    .join("")}
                </div>
              )}
              {isBright && (
                <>
                  <div
                    style={{
                      ...headline,
                      fontSize: fs,
                      position: "absolute",
                      left: x * 0.3 - width * 0.3,
                      color: "transparent",
                      WebkitTextStroke: `1.5px ${tint}`,
                      opacity: 0.6 * dimIn,
                      maskImage: `linear-gradient(90deg, black 0 22%, transparent 30% 70%, black 78%)`,
                    }}
                  >
                    {range(repeats)
                      .map(() => unit)
                      .join("")}
                  </div>
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      textAlign: "center",
                      transform: `translateX(${(r - mid) * fs * 0.25}px)`,
                    }}
                  >
                    <FlickerReveal
                      text={phrase}
                      start={7 + (r - brightRows[0]) * 2}
                      window={8}
                      outStart={outStart ?? dur - 8}
                      outWindow={6}
                      highlight={
                        (r - brightRows[0]) % 2 === 1 && highlightAlt
                          ? highlightAlt
                          : highlight
                      }
                      seed={`${seed}-b-${r}`}
                      style={{ fontSize: fs, color: colors.white }}
                    />
                  </div>
                </>
              )}
            </div>
          );
        })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
