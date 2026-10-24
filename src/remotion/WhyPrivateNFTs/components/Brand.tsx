import { noise2D } from "@remotion/noise";
import { evolvePath, getLength, getPointAtLength } from "@remotion/paths";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LOGOS } from "../assets";
import { colors, FONT, headline, neonGlow, springs } from "../theme";
import { Box3D } from "./Cubes";
import { ip, range, rnd, useLayout } from "./util";

// ───────────────────────── Cuboid (w × h × d) ─────────────────────────
export const Cuboid: React.FC<{
  w: number;
  h: number;
  d: number;
  top: React.CSSProperties;
  side: string;
  side2?: string;
  z?: number;
  children?: React.ReactNode;
}> = ({ w, h, d, top, side, side2, z = 0, children }) => (
  <div
    style={{
      position: "absolute",
      width: w,
      height: h,
      transformStyle: "preserve-3d",
      transform: `translateZ(${z}px)`,
    }}
  >
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `translateZ(${d}px)`,
        ...top,
      }}
    >
      {children}
    </div>
    {/* front (+y) */}
    <div
      style={{
        position: "absolute",
        left: 0,
        top: h - d / 2,
        width: w,
        height: d,
        background: side,
        transform: `translateZ(${d / 2}px) rotateX(-90deg)`,
      }}
    />
    {/* right (+x) */}
    <div
      style={{
        position: "absolute",
        left: w - d / 2,
        top: 0,
        width: d,
        height: h,
        background: side2 ?? side,
        transform: `translateZ(${d / 2}px) rotateY(90deg)`,
      }}
    />
  </div>
);

// ───────────────────────── IsoNetwork ─────────────────────────
const NODES: [number, number, string, "wire" | "solid"][] = [
  [-520, -260, colors.cyan, "wire"],
  [-300, -520, colors.purple, "solid"],
  [60, -600, colors.magenta, "wire"],
  [380, -470, colors.purple, "wire"],
  [600, -180, colors.cyan, "solid"],
  [-640, 80, colors.purple, "wire"],
  [-420, 330, colors.magenta, "wire"],
  [-120, 520, colors.cyan, "solid"],
  [-40, 820, colors.purple, "wire"],
  [980, -360, colors.magenta, "wire"],
  [-180, -330, colors.magenta, "wire"],
  [300, -250, colors.cyan, "solid"],
  [-760, -420, colors.purple, "solid"],
  [820, 60, colors.purple, "wire"],
];
const ZK_NODES = [3, 6, 11];

export const IsoNetwork: React.FC<{
  top: string;
  bottom: string;
  textAt: number;
  zk?: string;
}> = ({ top, bottom, textAt, zk = "zk" }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { portrait } = useLayout();
  const P = 2600;
  const C = P / 2;
  const chipPop = spring({ frame: f, fps, config: springs.pop });
  const camScale =
    (portrait ? 0.62 : 0.86) +
    ip(f, [0, 66], [0, 0.12], Easing.out(Easing.cubic));
  const links = NODES.map(([x, y], i) => {
    const mx = C + x;
    const my = C + y;
    const d =
      i % 2 === 0
        ? `M ${C} ${C} L ${mx} ${C} L ${mx} ${my}`
        : `M ${C} ${C} L ${C} ${my} L ${mx} ${my}`;
    return d;
  });
  const textPop = (k: number) =>
    spring({ frame: f - textAt - k * 3, fps, config: springs.snappy });
  return (
    <AbsoluteFill
      style={{
        perspective: 2400,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: P,
          height: P,
          flexShrink: 0,
          position: "relative",
          transformStyle: "preserve-3d",
          transform: `translateY(${portrait ? 0 : -60}px) scale(${camScale}) rotateX(57deg) rotateZ(38deg)`,
        }}
      >
        {/* iso floor grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(123,92,240,0.13) 0 2px, transparent 2px 130px), repeating-linear-gradient(90deg, rgba(123,92,240,0.13) 0 2px, transparent 2px 130px)",
            maskImage: "radial-gradient(circle, black 20%, transparent 62%)",
            WebkitMaskImage:
              "radial-gradient(circle, black 20%, transparent 62%)",
          }}
        />
        <svg
          width={P}
          height={P}
          style={{ position: "absolute", inset: 0, overflow: "visible" }}
        >
          {links.map((d, i) => {
            const p = ip(
              f,
              [4 + i * 1.5, 18 + i * 1.5],
              [0, 1],
              Easing.out(Easing.cubic),
            );
            const ev = evolvePath(p, d);
            const len = getLength(d);
            const dotT = ((f * 9 + i * 97) % len) / len;
            const dot = p > 0.95 ? getPointAtLength(d, dotT * len) : null;
            const col = NODES[i][2];
            return (
              <g key={i}>
                <path
                  d={d}
                  fill="none"
                  stroke={col}
                  strokeOpacity={0.75}
                  strokeWidth={3.5}
                  strokeDasharray={ev.strokeDasharray}
                  strokeDashoffset={ev.strokeDashoffset}
                  style={{ filter: `drop-shadow(0 0 6px ${col})` }}
                />
                {dot && (
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={9}
                    fill="#fff"
                    style={{ filter: `drop-shadow(0 0 10px ${col})` }}
                  />
                )}
              </g>
            );
          })}
        </svg>
        {NODES.map(([x, y, col, kind], i) => {
          const s = spring({
            frame: f - 8 - i * 1.6,
            fps,
            config: springs.pop,
          });
          const size = kind === "solid" ? 70 : 84;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: C + x - size / 2,
                top: C + y - size / 2,
                transformStyle: "preserve-3d",
                transform: `translateZ(${size / 2}px) scale(${s})`,
              }}
            >
              <Box3D
                size={size}
                rx={0}
                ry={0}
                face={() =>
                  kind === "solid"
                    ? {
                        background: col,
                        border: "2px solid rgba(255,255,255,0.6)",
                        boxShadow: `0 0 18px ${col}`,
                        opacity: 0.95,
                      }
                    : {
                        border: `4px solid ${col}`,
                        boxShadow: `${neonGlow(col, 0.5)}`,
                      }
                }
              />
              {ZK_NODES.includes(i) && f > textAt && (
                <div
                  style={{
                    position: "absolute",
                    left: -10,
                    top: -10,
                    transform: `translateZ(${size + 40}px) rotateZ(-38deg) rotateX(-57deg)`,
                    fontFamily: FONT,
                    fontWeight: 800,
                    fontSize: 44,
                    color: colors.cyan,
                    opacity:
                      0.45 + 0.55 * Math.abs(Math.sin((f - textAt) * 0.25 + i)),
                    textShadow: neonGlow(colors.cyan, 0.7),
                  }}
                >
                  {zk}
                </div>
              )}
            </div>
          );
        })}
        {/* chip slab with Aztec logo */}
        <div
          style={{
            position: "absolute",
            left: C - 160,
            top: C - 160,
            width: 320,
            height: 320,
            transformStyle: "preserve-3d",
            transform: `scale(${chipPop})`,
          }}
        >
          <Cuboid
            w={320}
            h={320}
            d={34}
            top={{
              background: "linear-gradient(135deg, #3EF0F7, #18B8C8)",
              borderRadius: 12,
            }}
            side="#12A3B5"
            side2="#0E8798"
          />
          <Cuboid
            w={280}
            h={280}
            d={46}
            z={34}
            top={{
              background: "linear-gradient(135deg, #9F86FF, #6A3FD8)",
              borderRadius: 14,
              border: "3px solid rgba(255,255,255,0.65)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 50px rgba(123,92,240,0.9)",
            }}
            side="#4B2FB0"
            side2="#3A2392"
          >
            <div
              style={{
                width: 170,
                height: 170,
                borderRadius: 30,
                overflow: "hidden",
                transform: "rotateZ(-38deg)",
                boxShadow: "0 0 30px rgba(0,0,0,0.4)",
              }}
            >
              <Img
                src={staticFile(LOGOS.aztec)}
                style={{ width: 170, height: 170 }}
              />
            </div>
          </Cuboid>
          {/* glow beam */}
          <div
            style={{
              position: "absolute",
              left: 20,
              top: 140,
              width: 280,
              height: 420,
              transformOrigin: "50% 100%",
              transform: "translateY(-280px) rotateZ(-38deg) rotateX(-90deg)",
              background:
                "linear-gradient(0deg, rgba(123,92,240,0.55), rgba(123,92,240,0))",
              opacity: ip(f, [6, 20], [0, 0.8]),
            }}
          />
        </div>
        {/* text lying on the plane */}
        <div
          style={{
            position: "absolute",
            left: C + 170,
            top: C + 120,
            transform: "translateZ(2px)",
          }}
        >
          <div
            style={{
              ...headline,
              fontSize: 88,
              letterSpacing: "0.06em",
              opacity: Math.min(1, textPop(0)),
              transform: `translateX(${(1 - textPop(0)) * -60}px)`,
              textShadow: "0 6px 0 rgba(0,0,0,0.35)",
            }}
          >
            {top}
          </div>
          <div
            style={{
              ...headline,
              fontSize: 170,
              letterSpacing: "0.04em",
              marginTop: 6,
              opacity: Math.min(1, textPop(2)),
              transform: `translateX(${(1 - textPop(2)) * -80}px)`,
              textShadow: "0 8px 0 rgba(0,0,0,0.35)",
            }}
          >
            {bottom}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── LogoRing ─────────────────────────
// Raven mark on a purple disc inside concentric rotating rings; a dot grows into the ring first
export const LogoRing: React.FC<{
  size?: number;
  dotAt?: number;
  discAt?: number;
  scale?: number;
}> = ({ size = 300, dotAt = 0, discAt = 8, scale = 1 }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ringP = ip(f, [dotAt, dotAt + 8], [0, 1], Easing.out(Easing.cubic));
  const disc = spring({ frame: f - discAt, fps, config: springs.pop });
  const R = size * 0.82;
  const view = R * 2.6;
  const c = view / 2;
  const arc = (
    r: number,
    len: number,
    rot: number,
    color: string,
    w: number,
    dash?: string,
  ) => {
    const circ = 2 * Math.PI * r;
    return (
      <circle
        cx={c}
        cy={c}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={w}
        strokeDasharray={dash ?? `${(len / 360) * circ} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(${rot} ${c} ${c})`}
      />
    );
  };
  return (
    <div
      style={{
        position: "relative",
        width: view,
        height: view,
        transform: `scale(${scale})`,
      }}
    >
      <svg
        width={view}
        height={view}
        style={{ position: "absolute", inset: 0, opacity: ringP }}
      >
        <defs>
          <linearGradient id="wpn-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={colors.cyan} />
            <stop offset="0.5" stopColor={colors.purple} />
            <stop offset="1" stopColor={colors.magenta} />
          </linearGradient>
        </defs>
        <g
          transform={`translate(${c} ${c}) scale(${0.2 + 0.8 * ringP}) translate(${-c} ${-c})`}
        >
          {arc(R * 0.76, 360, 0, "rgba(123,92,240,0.35)", 2)}
          {arc(R * 0.9, 0, f * 1.4, "url(#wpn-ring)", 16, "2 4")}
          {arc(R * 1.02, 250, -f * 2.2 + 40, colors.purple, 6)}
          {arc(R * 1.1, 70, f * 3 + 200, colors.magenta, 3)}
          {arc(R * 0.82, 120, -f * 1.2 + 120, colors.cyan, 4)}
          {arc(R * 1.18, 40, -f * 1.6 + 300, colors.lavender, 3)}
        </g>
        {ringP < 1 && (
          <circle cx={c} cy={c} r={14 * (1 - ringP) + 6} fill={colors.purple} />
        )}
      </svg>
      <div
        style={{
          position: "absolute",
          left: c - size / 2,
          top: c - size / 2,
          width: size,
          height: size,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 40% 35%, #8E72FF, #6A4FE0 60%, #5639C8)",
          boxShadow: "0 0 60px rgba(123,92,240,0.7)",
          transform: `scale(${disc})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: size * 0.66,
            height: size * 0.66,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 35%, #A58CFF, #8466F0)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile(LOGOS.ravenMarkWhite)}
            style={{ width: size * 0.5, marginLeft: size * 0.02 }}
          />
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── LogoResolve ─────────────────────────
const blobPath = (
  cx: number,
  cy: number,
  r: number,
  f: number,
  seed: string,
  wobble: number,
) => {
  const pts = range(64).map((i) => {
    const a = (i / 64) * Math.PI * 2;
    const n = noise2D(seed, Math.cos(a) * 0.9 + f * 0.012, Math.sin(a) * 0.9);
    const rr = r * (1 + n * wobble);
    return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
  });
  return `M ${pts.map((p) => p.join(" ")).join(" L ")} Z`;
};

// Purple blob grows and settles into an app-icon squircle with the raven mark,
// which then shrinks and slides left while the wordmark glitch-types in; URL fades in below.
export const LogoResolve: React.FC<{
  iconAt: number;
  shrinkAt: number;
  urlAt: number;
  url: string;
}> = ({ iconAt, shrinkAt, urlAt, url }) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height, portrait } = useLayout();
  const big = Math.max(width, height);
  const grow = ip(
    f,
    [0, iconAt, shrinkAt - 6],
    [0.06, 0.24, 0.72],
    Easing.inOut(Easing.cubic),
  );
  const blobOut = ip(
    f,
    [shrinkAt - 4, shrinkAt + 8],
    [0, 1],
    Easing.in(Easing.cubic),
  );
  const blobR = big * grow * (1 + blobOut * 0.4);
  const iconPop = spring({ frame: f - iconAt, fps, config: springs.pop });
  const shrink = spring({
    frame: f - shrinkAt,
    fps,
    config: springs.smooth,
    durationInFrames: 22,
  });
  const iconSize = ip(
    shrink,
    [0, 1],
    [portrait ? 380 : 440, portrait ? 150 : 170],
  );
  const wordW = portrait ? 620 : 560;
  const total = iconSize + 40 + wordW;
  const iconX = ip(shrink, [0, 1], [0, -(total / 2) + iconSize / 2]);
  const typeP = ip(f, [shrinkAt + 6, shrinkAt + 26], [0, 1]);
  const typeSteps = Math.floor(typeP * 10) / 10;
  const g = typeP > 0 && typeP < 1 ? 1 : 0;
  const step = Math.floor(f / 2);
  const urlOp = ip(f, [urlAt, urlAt + 10], [0, 1]);
  const wordmark = (extra: React.CSSProperties, src = LOGOS.ravenLetters) => (
    <Img
      src={staticFile(src)}
      style={{
        position: "absolute",
        inset: 0,
        width: wordW,
        height: wordW * (17 / 131),
        ...extra,
      }}
    />
  );
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: 1 - blobOut }}
      >
        <path
          d={blobPath(width / 2, height / 2, blobR, f, "blob", 0.14)}
          fill={f < shrinkAt - 10 ? "#4E3794" : "#33265F"}
          transform={`rotate(${f * 1.2} ${width / 2} ${height / 2})`}
        />
      </svg>
      <div style={{ position: "relative", width: total, height: iconSize }}>
        <div
          style={{
            position: "absolute",
            left: total / 2 - iconSize / 2 + iconX,
            top: 0,
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize * 0.26,
            background: "linear-gradient(145deg, #8E72FF, #6A4FE0)",
            boxShadow: "0 18px 50px rgba(20,10,60,0.5)",
            transform: `scale(${iconPop})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Img
            src={staticFile(LOGOS.ravenMarkWhite)}
            style={{ width: iconSize * 0.7, marginLeft: iconSize * 0.03 }}
          />
        </div>
        {typeP > 0 && (
          <div
            style={{
              position: "absolute",
              left: total / 2 - iconSize / 2 + iconX + iconSize + 40,
              top: iconSize / 2 - (wordW * (17 / 131)) / 2,
              width: wordW,
              height: wordW * (17 / 131),
            }}
          >
            {g > 0 && (
              <>
                {wordmark({
                  transform: "translateX(-6px)",
                  opacity: 0.7,
                  clipPath: `inset(0 ${100 - typeSteps * 100}% 0 0)`,
                  filter: "drop-shadow(0 0 0 #2EE6F0) hue-rotate(-80deg)",
                })}
                {wordmark({
                  transform: "translateX(6px)",
                  opacity: 0.7,
                  clipPath: `inset(0 ${100 - typeSteps * 100}% 0 0)`,
                  filter: "hue-rotate(60deg)",
                })}
              </>
            )}
            {wordmark(
              { clipPath: `inset(0 ${100 - typeSteps * 100}% 0 0)` },
              "wpn/logos/raven-house-letters-purple.svg",
            )}
            {g > 0 &&
              range(3).map((k) => {
                const top = rnd(`wm-t-${k}-${step}`) * 80;
                const hgt = 8 + rnd(`wm-h-${k}-${step}`) * 20;
                const x = (typeSteps + rnd(`wm-x-${k}-${step}`) * 0.12) * wordW;
                return (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: x,
                      top: `${top}%`,
                      width: 10 + rnd(`wm-w-${k}-${step}`) * 30,
                      height: `${hgt}%`,
                      background:
                        k === 0
                          ? "#fff"
                          : k === 1
                            ? colors.cyan
                            : colors.lavender,
                    }}
                  />
                );
              })}
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: iconSize + (portrait ? 70 : 60),
            left: 0,
            right: 0,
            textAlign: "center",
            fontFamily: FONT,
            fontWeight: 500,
            fontSize: portrait ? 38 : 34,
            letterSpacing: "0.06em",
            color: colors.white,
            opacity: urlOp,
          }}
        >
          {url}
        </div>
      </div>
    </AbsoluteFill>
  );
};
