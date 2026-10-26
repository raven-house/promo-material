import { noise2D } from "@remotion/noise";
import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../theme";
import { range, rnd, useLayout } from "./util";

const CELL_COLORS = [
  colors.purple,
  colors.magenta,
  colors.cyan,
  colors.purple,
  colors.lavender,
];

// Two diagonal hatch strips (top "/" and bottom "\") sliding horizontally
export const HatchStrips: React.FC<{ glitch?: number; opacity?: number }> = ({
  glitch = 0,
  opacity = 1,
}) => {
  const f = useCurrentFrame();
  const { height } = useLayout();
  const strip = (top: number, dir: 1 | -1, angle: number) => {
    const tint =
      glitch > 0.5 && rnd(`hatch-${top}-${Math.floor(f / 2)}`) < glitch * 0.35;
    return (
      <div
        style={{
          position: "absolute",
          left: -200,
          right: -200,
          top,
          height: 60,
          opacity,
          transform: `translateX(${((dir * f * 1.6) % 176) - 176}px)`,
          backgroundImage: `repeating-linear-gradient(${angle}deg, transparent 0 80px, ${
            tint ? "rgba(255,46,134,0.55)" : "rgba(185,163,255,0.24)"
          } 80px 85px)`,
        }}
      />
    );
  };
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {strip(height * 0.03, 1, 60)}
      {strip(height * 0.885, -1, 120)}
    </AbsoluteFill>
  );
};

// Faint grid of square cells centred on the frame; pattern reshuffles per `seed`
export const GridCells: React.FC<{
  seed: string;
  cols?: number;
  rows?: number;
  cell?: number;
  appear?: number;
  opacity?: number;
}> = ({ seed, cols = 13, rows = 3, cell = 116, appear = 1, opacity = 1 }) => {
  const f = useCurrentFrame();
  const driftX = noise2D(`${seed}-dx`, f * 0.01, 0) * 10;
  return (
    <div
      style={{
        position: "relative",
        width: cols * cell,
        height: rows * cell,
        transform: `translateX(${driftX}px)`,
        opacity,
      }}
    >
      {range(cols * rows).map((i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const edge = Math.abs(c - (cols - 1) / 2) / ((cols - 1) / 2);
        const keep = rnd(`${seed}-k-${i}`) < 0.62 - edge * 0.25;
        if (!keep) return null;
        const showAt = rnd(`${seed}-a-${i}`);
        if (showAt > appear) return null;
        const flick =
          rnd(`${seed}-fl-${i}-${Math.floor(f / 3)}`) < 0.08 ? 0.4 : 1;
        const lit = rnd(`${seed}-lit-${i}`) < 0.08;
        const color =
          CELL_COLORS[Math.floor(rnd(`${seed}-c-${i}`) * CELL_COLORS.length)];
        const jitter =
          rnd(`${seed}-j-${i}`) < 0.18
            ? (rnd(`${seed}-jy-${i}`) - 0.5) * cell * 0.5
            : 0;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * cell,
              top: r * cell + jitter,
              width: cell,
              height: cell,
              border: `1.5px solid ${color}`,
              opacity:
                (lit ? 0.55 : 0.2 + rnd(`${seed}-o-${i}`) * 0.12) * flick,
              boxShadow: lit ? `0 0 10px ${color}` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};

// Four small hollow squares framing a w×h box
export const CornerSquares: React.FC<{
  w: number;
  h: number;
  size?: number;
  opacity?: number;
}> = ({ w, h, size = 20, opacity = 1 }) => {
  const pts: [number, number, string][] = [
    [0, 0, colors.cyan],
    [w, 0, colors.purple],
    [0, h, colors.cyan],
    [w, h, colors.purple],
  ];
  return (
    <div style={{ position: "absolute", width: w, height: h, opacity }}>
      {pts.map(([x, y, c], i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
            border: `3px solid ${c}`,
            boxShadow: `0 0 6px ${c}`,
          }}
        />
      ))}
    </div>
  );
};

// A word centred in a faint cell grid, with optional corner squares and hatch strips
export const GridWord: React.FC<{
  seed: string;
  children: React.ReactNode;
  corners?: { w: number; h: number } | null;
  hatch?: boolean;
  glitch?: number;
  gridOpacity?: number;
  cols?: number;
  cell?: number;
}> = ({
  seed,
  children,
  corners = null,
  hatch = true,
  glitch = 0,
  gridOpacity = 1,
  cols,
  cell: cellProp,
}) => {
  const { portrait, width } = useLayout();
  const cell = cellProp ?? (portrait ? 92 : 116);
  const c = cols ?? Math.min(13, Math.floor((width * 0.95) / cell));
  return (
    <AbsoluteFill>
      {hatch && <HatchStrips glitch={glitch} />}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <GridCells seed={seed} cols={c} cell={cell} opacity={gridOpacity} />
      </AbsoluteFill>
      {corners && (
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <CornerSquares w={Math.min(corners.w, width * 0.9)} h={corners.h} />
        </AbsoluteFill>
      )}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
