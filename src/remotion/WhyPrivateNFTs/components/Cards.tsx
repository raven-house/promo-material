import { noise2D } from "@remotion/noise";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import type { NftAsset } from "../assets";
import { nftAt } from "../assets";
import { FONT, ui } from "../theme";
import { ip, range, rnd, useLayout } from "./util";

// Raven House NFT card chrome (bg #1D1C1B, border #3A3A3A, rounded-lg, image + name + price + Buy)
export const NftCard: React.FC<{
  nft: NftAsset;
  width: number;
  highlight?: number;
  style?: React.CSSProperties;
}> = ({ nft, width, highlight = 0, style }) => {
  const k = width / 220;
  return (
    <div
      style={{
        width,
        background: ui.card,
        border: `${Math.max(1, k)}px solid ${highlight > 0 ? `rgba(185,163,255,${0.4 + 0.6 * highlight})` : ui.cardBorder}`,
        borderRadius: 8 * k,
        overflow: "hidden",
        fontFamily: FONT,
        color: ui.text,
        boxShadow:
          highlight > 0
            ? `0 0 ${24 * highlight * k}px rgba(95,60,119,0.8)`
            : undefined,
        ...style,
      }}
    >
      <Img
        src={staticFile(nft.src)}
        style={{
          width,
          height: width,
          objectFit: "cover",
          display: "block",
          borderRadius: 8 * k,
        }}
      />
      <div style={{ padding: 9 * k }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14 * k,
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {nft.collection} {nft.name}
        </div>
        <div style={{ fontSize: 11 * k, color: ui.gray400, marginTop: 3 * k }}>
          {nft.collection}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 9 * k,
          }}
        >
          <div style={{ fontSize: 13 * k, fontWeight: 700 }}>
            {nft.price}{" "}
            <span
              style={{ fontSize: 9 * k, color: ui.gray400, fontWeight: 500 }}
            >
              USDC
            </span>
          </div>
          <div
            style={{
              background: ui.primary,
              color: "#fff",
              fontSize: 11 * k,
              fontWeight: 600,
              padding: `${4 * k}px ${14 * k}px`,
              borderRadius: 6 * k,
            }}
          >
            Buy
          </div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────── TiltedScreen ─────────────────────────
export type Cam = {
  f: number;
  rx?: number;
  ry?: number;
  rz?: number;
  z?: number;
  x?: number;
  y?: number;
  s?: number;
};

export const camAt = (keys: Cam[], f: number) => {
  const get = (p: keyof Omit<Cam, "f">, d: number) =>
    interpolate(
      f,
      keys.map((k) => k.f),
      keys.map((k) => k[p] ?? d),
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.cubic),
      },
    );
  return {
    rx: get("rx", 0),
    ry: get("ry", 0),
    rz: get("rz", 0),
    z: get("z", 0),
    x: get("x", 0),
    y: get("y", 0),
    s: get("s", 1),
  };
};

export const camTransform = (c: ReturnType<typeof camAt>) =>
  `translate3d(${c.x}px, ${c.y}px, ${c.z}px) rotateX(${c.rx}deg) rotateY(${c.ry}deg) rotateZ(${c.rz}deg) scale(${c.s})`;

// An app screen on a 3D-tilted plane with depth-of-field imitation
export const TiltedScreen: React.FC<{
  children: React.ReactNode;
  w: number;
  h: number;
  keys: Cam[];
  // gradient angle that points to the far edge, focus band centre 0..1, blur px
  dof?: { angle: number; focus: number; blur: number } | null;
  perspective?: number;
  frame?: boolean;
  bg?: string;
  // uniform camera push (the reference keeps app screens very close to camera)
  zoom?: number;
}> = ({
  children,
  w,
  h,
  keys,
  dof = null,
  perspective = 1800,
  frame = true,
  bg = ui.bg,
  zoom = 1,
}) => {
  const f = useCurrentFrame();
  const c = camAt(keys, f);
  const panel: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 16,
    overflow: "hidden",
    background: bg,
  };
  return (
    <AbsoluteFill
      style={{ perspective, justifyContent: "center", alignItems: "center" }}
    >
      <div
        style={{
          width: w,
          height: h,
          position: "relative",
          transform: `scale(${zoom}) ${camTransform(c)}`,
          border: frame ? "1px solid rgba(185,163,255,0.55)" : undefined,
          borderRadius: 16,
          boxShadow: frame
            ? "0 0 60px rgba(123,92,240,0.35), 0 40px 120px rgba(0,0,0,0.6)"
            : undefined,
        }}
      >
        <div style={panel}>{children}</div>
        {dof && (
          <div
            style={{
              ...panel,
              filter: `blur(${dof.blur}px)`,
              maskImage: `linear-gradient(${dof.angle}deg, transparent 0%, transparent ${dof.focus * 100 - 18}%, black ${dof.focus * 100 + 22}%, black 100%)`,
              WebkitMaskImage: `linear-gradient(${dof.angle}deg, transparent 0%, transparent ${dof.focus * 100 - 18}%, black ${dof.focus * 100 + 22}%, black 100%)`,
            }}
          >
            {children}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── CardGrid3D ─────────────────────────
// Infinite-looking grid of NFT cards on a tilted plane; the camera dollies and the focus racks.
export const CardGrid3D: React.FC<{
  keys: Cam[];
  // focus point in plane coordinates over time: [frame, x, y][]
  focus: [number, number, number][];
  cols?: number;
  rows?: number;
  card?: number;
  gap?: number;
  seed?: number;
  maxBlur?: number;
  highlightIndex?: number;
  highlight?: number;
}> = ({
  keys,
  focus,
  cols = 12,
  rows = 8,
  card = 250,
  gap = 28,
  seed = 0,
  maxBlur = 7,
  highlightIndex = -1,
  highlight = 0,
}) => {
  const f = useCurrentFrame();
  const c = camAt(keys, f);
  const cardH = card * 1.42;
  const W = cols * (card + gap);
  const H = rows * (cardH + gap);
  const fx = interpolate(
    f,
    focus.map((p) => p[0]),
    focus.map((p) => p[1]),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  const fy = interpolate(
    f,
    focus.map((p) => p[0]),
    focus.map((p) => p[2]),
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.inOut(Easing.cubic),
    },
  );
  return (
    <AbsoluteFill
      style={{
        perspective: 1500,
        justifyContent: "center",
        alignItems: "center",
        background: "#17151c",
      }}
    >
      <div
        style={{
          width: W,
          height: H,
          position: "relative",
          transform: camTransform(c),
          flexShrink: 0,
        }}
      >
        {range(cols * rows).map((i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = col * (card + gap);
          const y = row * (cardH + gap);
          const d = Math.hypot(x + card / 2 - fx, (y + cardH / 2 - fy) * 1.6);
          const blur = Math.min(
            maxBlur,
            Math.max(0, (d - card * 0.9) / (card * 0.55)),
          );
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: x,
                top: y,
                filter: blur > 0.6 ? `blur(${blur.toFixed(1)}px)` : undefined,
              }}
            >
              <NftCard
                nft={nftAt(i * 7 + seed)}
                width={card}
                highlight={i === highlightIndex ? highlight : 0}
                style={{ background: "#2c2935", borderColor: "#3b3746" }}
              />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── CardMosaic ─────────────────────────
// Three parallax layers of floating NFT cards (near and far layers blurred)
export const CardMosaic: React.FC<{ seed?: string; speed?: number }> = ({
  seed = "mosaic",
  speed = 1,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useLayout();
  const layers = [
    { n: 44, card: 105, blur: 2.5, v: 0.35, op: 0.8 },
    { n: 22, card: 165, blur: 0, v: 0.8, op: 1 },
    { n: 5, card: 300, blur: 8, v: 1.6, op: 0.95 },
  ];
  return (
    <AbsoluteFill style={{ background: "#120e26" }}>
      {layers.map((L, li) => (
        <AbsoluteFill
          key={li}
          style={{
            filter: L.blur ? `blur(${L.blur}px)` : undefined,
            opacity: L.op,
          }}
        >
          {range(L.n).map((i) => {
            const cols = Math.ceil(Math.sqrt(L.n * (width / height)));
            const rowsN = Math.ceil(L.n / cols);
            // the near layer stays at the frame edges so the centre text reads
            const cx =
              li === 2
                ? (i % 2 === 0 ? 0.06 : 0.94) +
                  (rnd(`${seed}-${li}-jx-${i}`) - 0.5) * 0.08
                : ((i % cols) +
                    0.5 +
                    (rnd(`${seed}-${li}-jx-${i}`) - 0.5) * 0.6) /
                  cols;
            const cy =
              (Math.floor(i / cols) +
                0.5 +
                (rnd(`${seed}-${li}-jy-${i}`) - 0.5) * 0.5) /
              rowsN;
            const x =
              cx * width * 1.1 -
              width * 0.05 -
              f * L.v * speed * 0.6 +
              noise2D(`${seed}-${li}-${i}`, f * 0.01, 0) * 10;
            const y = cy * height * 1.15 - height * 0.07 - f * L.v * speed;
            const rot = (rnd(`${seed}-${li}-r-${i}`) - 0.5) * 10;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: x - L.card / 2,
                  top: y - L.card * 0.7,
                  transform: `rotate(${rot}deg)`,
                }}
              >
                <NftCard
                  nft={nftAt(i * 3 + li * 17)}
                  width={L.card}
                  style={{ background: "#3B2F7A", borderColor: "#4E3FA0" }}
                />
              </div>
            );
          })}
        </AbsoluteFill>
      ))}
    </AbsoluteFill>
  );
};

// ───────────────────────── CardTunnel ─────────────────────────
// Mirrored floor + ceiling planes of NFT cards scrolling toward the camera, dark band in the middle
export const CardTunnel: React.FC<{
  band?: number;
  speed?: number;
  seed?: number;
}> = ({ band = 230, speed = 9, seed = 3 }) => {
  const f = useCurrentFrame();
  const { width, height, portrait } = useLayout();
  const card = portrait ? 300 : 360;
  const gap = 22;
  const cols = Math.ceil((width * 2.6) / (card + gap));
  const rowH = card * 1.42 + gap;
  const rows = 9;
  const scroll = (f * speed) % rowH;
  const plane = (top: boolean) => (
    <div
      style={{
        position: "absolute",
        left: (width - cols * (card + gap)) / 2,
        width: cols * (card + gap),
        height: rows * rowH,
        top: top ? height / 2 - band / 2 - rows * rowH : height / 2 + band / 2,
        transformOrigin: top ? "50% 100%" : "50% 0%",
        transform: `rotateX(${top ? -76 : 76}deg)`,
      }}
    >
      {range(cols * (rows + 1)).map((i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const y = top
          ? rows * rowH - (r + 1) * rowH + scroll
          : r * rowH - rowH + scroll;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: c * (card + gap) + (r % 2) * (card / 2),
              top: y,
              transform: top ? "scaleY(-1)" : undefined,
            }}
          >
            <NftCard
              nft={nftAt(i * 5 + seed + (top ? 11 : 0))}
              width={card}
              style={{ background: "#3B2F7A", borderColor: "#4E3FA0" }}
            />
          </div>
        );
      })}
    </div>
  );
  return (
    <AbsoluteFill
      style={{
        perspective: 700,
        perspectiveOrigin: "50% 50%",
        background: "#0E0A22",
        overflow: "hidden",
      }}
    >
      {plane(true)}
      {plane(false)}
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, transparent 0%, transparent calc(50% - ${band}px), rgba(14,10,34,0.96) calc(50% - ${band / 2}px), rgba(14,10,34,0.96) calc(50% + ${band / 2}px), transparent calc(50% + ${band}px), transparent 100%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// Seeded scatter helper for screenshot "bubbles" etc.
export const jitter = (seed: string, f: number, amp = 10) => ({
  x: noise2D(`${seed}-x`, f * 0.01, 0) * amp,
  y: noise2D(`${seed}-y`, 0, f * 0.01) * amp,
});

export const fadeIn = (f: number, a: number, b: number) =>
  ip(f, [a, b], [0, 1]);
