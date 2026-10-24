import { noise2D } from "@remotion/noise";
import type { LucideIcon } from "lucide-react";
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
import { colors, GRADIENT, springs } from "../theme";
import { ip, range, rnd, rr, useLayout } from "./util";

// ───────────────────────── BauhausBackdrop ─────────────────────────
const TILE_FILL = [
  "linear-gradient(160deg, #B9A3FF 0%, #7B5CF0 70%)",
  "linear-gradient(200deg, #9C84FF 0%, #6A3FD8 80%)",
  "linear-gradient(90deg, rgba(14,10,34,0) 0%, #5B45C9 100%)",
  "linear-gradient(180deg, #8F78FF 0%, rgba(14,10,34,0) 100%)",
  "linear-gradient(135deg, #FF2E86 0%, rgba(14,10,34,0) 55%)",
];
type TileKind =
  | "half-t"
  | "half-b"
  | "half-l"
  | "half-r"
  | "quarter"
  | "circle"
  | "rect"
  | "empty";
const KINDS: TileKind[] = [
  "half-t",
  "half-b",
  "half-l",
  "half-r",
  "quarter",
  "circle",
  "rect",
  "rect",
  "empty",
  "empty",
];

export const BauhausBackdrop: React.FC<{ seed?: string; tile?: number }> = ({
  seed = "bauhaus",
  tile = 236,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, height } = useLayout();
  const cols = Math.ceil(width / tile) + 2;
  const rows = Math.ceil(height / tile) + 2;
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {range(cols * rows).map((i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const kind = KINDS[Math.floor(rnd(`${seed}-k-${i}`) * KINDS.length)];
        if (kind === "empty") return null;
        const fill =
          TILE_FILL[Math.floor(rnd(`${seed}-f-${i}`) * TILE_FILL.length)];
        const delay = rnd(`${seed}-d-${i}`) * 8;
        const p = spring({ frame: f - delay, fps, config: springs.snappy });
        const dir = Math.floor(rnd(`${seed}-dir-${i}`) * 4);
        const off = (1 - p) * tile * 1.4;
        const dx = dir === 0 ? -off : dir === 1 ? off : 0;
        const dy = dir === 2 ? -off : dir === 3 ? off : 0;
        const slide = (r % 2 === 0 ? 1 : -1) * f * 0.8;
        const s = tile - 14;
        const radius: Record<TileKind, string> = {
          "half-t": `${s / 2}px ${s / 2}px 0 0`,
          "half-b": `0 0 ${s / 2}px ${s / 2}px`,
          "half-l": `${s / 2}px 0 0 ${s / 2}px`,
          "half-r": `0 ${s / 2}px ${s / 2}px 0`,
          quarter: `${s}px 0 0 0`,
          circle: "50%",
          rect: "0",
          empty: "0",
        };
        const h =
          kind.startsWith("half-t") || kind.startsWith("half-b") ? s / 2 : s;
        const w =
          kind.startsWith("half-l") || kind.startsWith("half-r") ? s / 2 : s;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: (c - 1) * tile + dx + slide + (tile - w) / 2,
              top: (r - 1) * tile + dy + (tile - h) / 2,
              width: w,
              height: h,
              borderRadius: radius[kind],
              background: fill,
              opacity: p,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ───────────────────────── GradientCard ─────────────────────────
const SAT = [
  { x: -0.62, y: -0.62, w: 0.42, h: 0.62, fill: GRADIENT },
  {
    x: 0.05,
    y: -0.92,
    w: 0.55,
    h: 0.45,
    fill: "linear-gradient(135deg, #8E78FF, #5D45D8)",
  },
  { x: 0.66, y: -0.55, w: 0.48, h: 0.55, fill: GRADIENT },
  {
    x: 0.98,
    y: -0.05,
    w: 0.18,
    h: 0.22,
    fill: "linear-gradient(135deg, #8E78FF, #6A3FD8)",
  },
  { x: -0.9, y: 0.25, w: 0.08, h: 0.3, fill: "glint-c" },
  { x: -0.55, y: 0.05, w: 0.06, h: 0.32, fill: "glint-m" },
  { x: 0.62, y: 0.12, w: 0.05, h: 0.35, fill: "glint-m" },
  {
    x: 0.75,
    y: 0.55,
    w: 0.45,
    h: 0.6,
    fill: "linear-gradient(135deg, #7B5CF0, #3E2B9E)",
  },
  {
    x: 0.0,
    y: 0.95,
    w: 0.4,
    h: 0.18,
    fill: "linear-gradient(135deg, #8E78FF, #6A3FD8)",
  },
  { x: -0.42, y: 0.72, w: 0.55, h: 0.42, fill: "fade" },
  { x: -0.25, y: -0.92, w: 0.4, h: 0.12, fill: "glint-m-h" },
];

const satFill = (k: string) => {
  if (k === "glint-c")
    return `linear-gradient(180deg, ${colors.cyan}, rgba(46,230,240,0))`;
  if (k === "glint-m")
    return `linear-gradient(180deg, rgba(255,46,134,0), ${colors.magenta})`;
  if (k === "glint-m-h")
    return `linear-gradient(180deg, ${colors.magenta}, rgba(255,46,134,0))`;
  if (k === "fade")
    return "linear-gradient(90deg, rgba(123,92,240,0), #6A55E0)";
  return k;
};

export const GradientCard: React.FC<{
  Icon: LucideIcon;
  label: React.ReactNode;
  w?: number;
  h?: number;
  // frame at which satellites pop (relative)
  popAt?: number;
  // frame of cursor click (relative); null = no cursor
  clickAt?: number | null;
  showCard?: boolean;
  satellites?: boolean;
  scale?: number;
  iconDraw?: number;
}> = ({
  Icon,
  label,
  w = 700,
  h = 430,
  popAt = 0,
  clickAt = null,
  showCard = true,
  satellites = true,
  scale = 1,
  iconDraw = 1,
}) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { portrait } = useLayout();
  const cw = portrait ? w * 0.82 : w;
  const ch = portrait ? h * 0.82 : h;
  const drift = (k: number) => noise2D(`sat-${k}`, f * 0.02, 0) * 14;
  const click =
    clickAt === null
      ? 0
      : spring({
          frame: f - clickAt,
          fps,
          config: springs.pop,
          durationInFrames: 12,
        });
  const press =
    clickAt === null
      ? 1
      : 1 -
        0.08 * Math.sin(Math.min(1, Math.max(0, (f - clickAt) / 8)) * Math.PI);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
      <div
        style={{
          position: "relative",
          width: cw,
          height: ch,
          transform: `scale(${scale})`,
        }}
      >
        {satellites &&
          SAT.map((s, k) => {
            const p = spring({
              frame: f - popAt - k * 1.5,
              fps,
              config: springs.pop,
            });
            return (
              <div
                key={k}
                style={{
                  position: "absolute",
                  left: cw / 2 + s.x * cw - (s.w * cw) / 2 + drift(k),
                  top: ch / 2 + s.y * ch - (s.h * ch) / 2 + drift(k + 9),
                  width: s.w * cw,
                  height: s.h * ch,
                  background: satFill(s.fill),
                  borderRadius: 10,
                  transform: `scale(${p})`,
                  boxShadow: s.fill.startsWith("glint")
                    ? `0 0 18px ${s.fill.includes("-c") ? colors.cyan : colors.magenta}`
                    : undefined,
                  opacity: Math.min(1, p),
                }}
              />
            );
          })}
        {showCard && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: GRADIENT,
              borderRadius: 14,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 30px 80px rgba(20,10,60,0.6)",
            }}
          >
            <div
              style={{
                transform: `scale(${press})`,
                position: "relative",
                clipPath: `inset(${(1 - iconDraw) * 100}% 0 0 0)`,
              }}
            >
              <Icon size={ch * 0.42} color="#fff" strokeWidth={1.1} />
              {clickAt !== null && f >= clickAt - 10 && (
                <svg
                  width={ch * 0.16}
                  height={ch * 0.16}
                  viewBox="0 0 24 24"
                  style={{
                    position: "absolute",
                    left:
                      ch * 0.28 +
                      ip(
                        f,
                        [clickAt - 10, clickAt - 2],
                        [ch * 0.25, 0],
                        Easing.out(Easing.cubic),
                      ),
                    top:
                      ch * 0.28 +
                      ip(
                        f,
                        [clickAt - 10, clickAt - 2],
                        [ch * 0.18, 0],
                        Easing.out(Easing.cubic),
                      ),
                    opacity: ip(f, [clickAt - 10, clickAt - 6], [0, 1]),
                  }}
                >
                  <path
                    d="M4 3 L4 19 L8.5 14.5 L11.5 21 L14 20 L11 13.5 L17.5 13.5 Z"
                    fill="#7B5CF0"
                    stroke="#fff"
                    strokeWidth={1.4}
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {clickAt !== null && click > 0 && click < 0.98 && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    width: ch * 0.6 * click,
                    height: ch * 0.6 * click,
                    marginLeft: -(ch * 0.3 * click),
                    marginTop: -(ch * 0.3 * click),
                    borderRadius: "50%",
                    border: "3px solid rgba(255,255,255,0.8)",
                    opacity: 1 - click,
                  }}
                />
              )}
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            top: ch + ch * 0.12,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── GradientWipe ─────────────────────────
// Hourglass silhouette (concave edges) that grows to cover the frame, then shrinks into `target`
export const GradientWipe: React.FC<{
  grow?: [number, number];
  shrink?: [number, number];
  target?: { w: number; h: number; x?: number; y?: number };
}> = ({ grow = [0, 7], shrink = [9, 16], target }) => {
  const f = useCurrentFrame();
  const { width, height } = useLayout();
  const g = ip(f, grow, [0, 1], Easing.out(Easing.cubic));
  const s = target ? ip(f, shrink, [0, 1], Easing.inOut(Easing.cubic)) : 0;
  if (f > (target ? shrink[1] : grow[1] + 6)) return null;
  const tw = target?.w ?? width;
  const th = target?.h ?? height;
  const tx = (target?.x ?? width / 2) - tw / 2;
  const ty = (target?.y ?? height / 2) - th / 2;
  // full-cover rect slightly larger than frame
  const coverW = width * 1.25;
  const coverH = height * 1.5;
  const startW = width * 0.25;
  const startH = height * 0.2;
  let w = startW + (coverW - startW) * g;
  let hh = startH + (coverH - startH) * g;
  let cx = width / 2;
  let cy = height / 2;
  w = w + (tw - w) * s;
  hh = hh + (th - hh) * s;
  cx = cx + (tx + tw / 2 - cx) * s;
  cy = cy + (ty + th / 2 - cy) * s;
  const conc = (1 - s) * (0.16 + 0.08 * (1 - g));
  const x0 = cx - w / 2;
  const x1 = cx + w / 2;
  const y0 = cy - hh / 2;
  const y1 = cy + hh / 2;
  const dy = hh * conc;
  const dx = w * conc * 0.35;
  const d = `M ${x0} ${y0} Q ${cx} ${y0 + dy * 2} ${x1} ${y0} Q ${x1 - dx * 2} ${cy} ${x1} ${y1} Q ${cx} ${y1 - dy * 2} ${x0} ${y1} Q ${x0 + dx * 2} ${cy} ${x0} ${y0} Z`;
  return (
    <AbsoluteFill>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id="wpn-wipe" x1="0" y1="0.2" x2="1" y2="0.8">
            <stop offset="0" stopColor={colors.cyan} />
            <stop offset="0.55" stopColor={colors.purple} />
            <stop offset="1" stopColor={colors.violet} />
          </linearGradient>
        </defs>
        <path d={d} fill="url(#wpn-wipe)" />
      </svg>
    </AbsoluteFill>
  );
};

// ───────────────────────── OrbitRings ─────────────────────────
type Arc = {
  r: number;
  thick: number;
  len: number;
  start: number;
  speed: number;
  dots?: boolean;
  thin?: boolean;
  colorSet?: number;
};
const ARC_GRADIENTS = [
  [colors.cyan, colors.purple],
  [colors.purple, colors.lavender],
  [colors.magenta, colors.purple],
  ["#3D7BFF", colors.purple],
];

export const OrbitRings: React.FC<{
  arcs?: Arc[];
  spin?: number;
  opacity?: number;
  scale?: number;
}> = ({ arcs, spin = 1, opacity = 1, scale = 1 }) => {
  const f = useCurrentFrame();
  const { width, height } = useLayout();
  const base = Math.min(width, height);
  const list: Arc[] = arcs ?? [
    {
      r: 0.52,
      thick: 46,
      len: 75,
      start: 200,
      speed: 0.9,
      dots: true,
      colorSet: 0,
    },
    {
      r: 0.52,
      thick: 46,
      len: 60,
      start: 20,
      speed: 0.9,
      dots: true,
      colorSet: 1,
    },
    {
      r: 0.44,
      thick: 28,
      len: 55,
      start: 120,
      speed: -1.3,
      dots: true,
      colorSet: 1,
    },
    {
      r: 0.44,
      thick: 28,
      len: 45,
      start: 300,
      speed: -1.3,
      dots: true,
      colorSet: 0,
    },
    {
      r: 0.68,
      thick: 3,
      len: 110,
      start: 60,
      speed: 0.6,
      thin: true,
      colorSet: 2,
    },
    {
      r: 0.48,
      thick: 3,
      len: 90,
      start: 240,
      speed: -0.5,
      thin: true,
      colorSet: 2,
    },
  ];
  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${scale})` }}>
      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          {ARC_GRADIENTS.map(([a, b], k) => (
            <linearGradient
              key={k}
              id={`wpn-arc-${k}`}
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0" stopColor={a} />
              <stop offset="1" stopColor={b} />
            </linearGradient>
          ))}
        </defs>
        {list.map((a, k) => {
          const r = a.r * base;
          const circ = 2 * Math.PI * r;
          const rot = a.start + f * a.speed * spin;
          const end = ((rot + a.len) * Math.PI) / 180;
          const beg = (rot * Math.PI) / 180;
          return (
            <g key={k}>
              <circle
                cx={width / 2}
                cy={height / 2}
                r={r}
                fill="none"
                stroke={`url(#wpn-arc-${a.colorSet ?? 0})`}
                strokeWidth={a.thick}
                strokeLinecap="round"
                strokeDasharray={`${(a.len / 360) * circ} ${circ}`}
                transform={`rotate(${rot} ${width / 2} ${height / 2})`}
                opacity={a.thin ? 0.7 : 1}
              />
              {a.dots &&
                [beg, end].map((ang, j) => (
                  <circle
                    key={j}
                    cx={width / 2 + Math.cos(ang) * r}
                    cy={height / 2 + Math.sin(ang) * r}
                    r={a.thick * 0.42}
                    fill={j === 0 ? colors.cyan : colors.lavender}
                    stroke="#0E0A22"
                    strokeWidth={2}
                  />
                ))}
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Filled glowing purple disc behind a word (AND / KEEP YOUR shots)
export const Orb: React.FC<{
  size: number;
  x?: number;
  y?: number;
  blur?: number;
  opacity?: number;
}> = ({ size, x = 0, y = 0, blur = 6, opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      left: `calc(50% + ${x - size / 2}px)`,
      top: `calc(50% + ${y - size / 2}px)`,
      width: size,
      height: size,
      borderRadius: "50%",
      background:
        "radial-gradient(circle at 40% 35%, #9B7BFF 0%, #7B5CF0 55%, #5B3FD0 100%)",
      filter: `blur(${blur}px)`,
      opacity,
    }}
  />
);

// ───────────────────────── BubbleField ─────────────────────────
const BUBBLE_FILL = [
  "radial-gradient(circle at 30% 30%, #B9A3FF, #7B5CF0 70%)",
  "radial-gradient(circle at 70% 30%, #FF2E86, #6A3FD8 75%)",
  "radial-gradient(circle at 30% 30%, #2EE6F0, #7B5CF0 70%)",
  "radial-gradient(circle at 40% 40%, #8F78FF, #3E2B9E 80%)",
  "linear-gradient(160deg, #6A3FD8, rgba(14,10,34,0.2))",
];

export const BubbleField: React.FC<{
  seed?: string;
  count?: number;
  ring?: boolean;
  ringR?: number;
  marks?: boolean;
  clearCenter?: number;
  appear?: number;
  scale?: number;
}> = ({
  seed = "bubbles",
  count = 60,
  ring = true,
  ringR = 330,
  marks = true,
  clearCenter = 0.36,
  appear = 1,
  scale = 1,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useLayout();
  const base = Math.min(width, height);
  return (
    <AbsoluteFill style={{ transform: `scale(${scale})` }}>
      {range(count).map((i) => {
        let x = rr(`${seed}-x-${i}`, -0.05, 1.05);
        let y = rr(`${seed}-y-${i}`, -0.05, 1.05);
        const dxc = (x - 0.5) * width;
        const dyc = (y - 0.5) * height;
        const dist = Math.hypot(dxc, dyc);
        if (dist < base * clearCenter) {
          const k = (base * clearCenter) / Math.max(1, dist);
          x = 0.5 + (dxc * k) / width;
          y = 0.5 + (dyc * k) / height;
        }
        const big = rnd(`${seed}-b-${i}`) < 0.26;
        const size = big
          ? rr(`${seed}-s-${i}`, 200, 420)
          : rr(`${seed}-s-${i}`, 26, 150);
        const isMark = marks && rnd(`${seed}-m-${i}`) < 0.22 && size > 70;
        const nx = noise2D(`${seed}-nx-${i}`, f * 0.008, 0) * 40;
        const ny = noise2D(`${seed}-ny-${i}`, 0, f * 0.008) * 40;
        const pop = ip(
          appear,
          [rnd(`${seed}-a-${i}`) * 0.7, rnd(`${seed}-a-${i}`) * 0.7 + 0.3],
          [0, 1],
        );
        const left = x * width + nx - size / 2;
        const top = y * height + ny - size / 2;
        if (isMark) {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left,
                top,
                width: size,
                height: size,
                transform: `scale(${pop})`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -size * 0.14,
                  borderRadius: "50%",
                  border: `2px solid rgba(46,230,240,0.55)`,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle at 35% 30%, #9B7BFF, #6A3FD8)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Img
                  src={staticFile(LOGOS.ravenMarkWhite)}
                  style={{ width: size * 0.62 }}
                />
              </div>
            </div>
          );
        }
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left,
              top,
              width: size,
              height: size,
              borderRadius: "50%",
              background:
                BUBBLE_FILL[
                  Math.floor(rnd(`${seed}-f-${i}`) * BUBBLE_FILL.length)
                ],
              opacity:
                (0.75 + rnd(`${seed}-o-${i}`) * 0.25) * Math.min(1, pop * 1.5),
              transform: `scale(${pop})`,
            }}
          />
        );
      })}
      {ring && (
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              width: ringR * 2,
              height: ringR * 2,
              borderRadius: "50%",
              border: "3px solid transparent",
              background: `linear-gradient(${colors.bg}, ${colors.bg}) padding-box, linear-gradient(140deg, ${colors.cyan}, ${colors.purple} 50%, ${colors.magenta}) border-box`,
              transform: `rotate(${f * 0.6}deg) scale(${ip(appear, [0, 0.6], [0.8, 1])})`,
              boxShadow: "0 0 40px rgba(14,10,34,0.9)",
            }}
          />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
