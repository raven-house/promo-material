import { noise2D, noise3D } from "@remotion/noise";
import type { LucideIcon } from "lucide-react";
import type React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { LOGOS } from "../assets";
import { colors, neonGlow } from "../theme";
import { range, rnd, rr, useLayout } from "./util";

type FaceStyle = (face: number) => React.CSSProperties;

const FACE_TRANSFORMS = (s: number) => [
  `translateZ(${s / 2}px)`,
  `rotateY(180deg) translateZ(${s / 2}px)`,
  `rotateY(90deg) translateZ(${s / 2}px)`,
  `rotateY(-90deg) translateZ(${s / 2}px)`,
  `rotateX(90deg) translateZ(${s / 2}px)`,
  `rotateX(-90deg) translateZ(${s / 2}px)`,
];

// Generic CSS 3D box (cube when h/d omitted)
export const Box3D: React.FC<{
  size: number;
  rx?: number;
  ry?: number;
  rz?: number;
  face: FaceStyle;
  children?: (face: number) => React.ReactNode;
  style?: React.CSSProperties;
}> = ({ size, rx = 0, ry = 0, rz = 0, face, children, style }) => (
  <div
    style={{
      position: "relative",
      width: size,
      height: size,
      transformStyle: "preserve-3d",
      transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg)`,
      ...style,
    }}
  >
    {FACE_TRANSFORMS(size).map((t, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          inset: 0,
          transform: t,
          backfaceVisibility: "visible",
          ...face(i),
        }}
      >
        {children?.(i)}
      </div>
    ))}
  </div>
);

export const NeonCube: React.FC<{
  size: number;
  color: string;
  rx: number;
  ry: number;
  rz?: number;
  border?: number;
  glow?: number;
}> = ({ size, color, rx, ry, rz = 0, border = 3, glow = 1 }) => (
  <Box3D
    size={size}
    rx={rx}
    ry={ry}
    rz={rz}
    face={() => ({
      border: `${border}px solid ${color}`,
      boxShadow:
        glow > 0
          ? `${neonGlow(color, 0.6 * glow)}, inset 0 0 ${10 * glow}px ${color}`
          : undefined,
      borderRadius: size * 0.04,
    })}
  />
);

const NEON = [
  colors.cyan,
  colors.magenta,
  colors.purple,
  "#8F6BFF",
  colors.cyan,
  colors.magenta,
];

// Wireframe cubes drifting and rotating at seeded depths; depth controls blur, scale and opacity
export const NeonCubeField: React.FC<{
  count?: number;
  seed?: string;
  focus?: number;
  blurBoost?: number;
  speed?: number;
  opacity?: number;
}> = ({
  count = 22,
  seed = "field",
  focus = 0.85,
  blurBoost = 1,
  speed = 1,
  opacity = 1,
}) => {
  const f = useCurrentFrame();
  const { width, height } = useLayout();
  return (
    <AbsoluteFill style={{ opacity }}>
      {range(count).map((i) => {
        const z = rnd(`${seed}-z-${i}`);
        let x0 = rr(`${seed}-x-${i}`, -0.05, 1.05);
        let y0 = rr(`${seed}-y-${i}`, -0.05, 1.05);
        // keep the centre (hero object + headline) clear
        const dx = (x0 - 0.5) * width;
        const dy = (y0 - 0.5) * height;
        const d = Math.hypot(dx, dy);
        const clear = Math.min(width, height) * 0.42;
        if (d < clear) {
          x0 = 0.5 + (dx * clear) / Math.max(1, d) / width;
          y0 = 0.5 + (dy * clear) / Math.max(1, d) / height;
        }
        const x =
          x0 * width + noise2D(`${seed}-nx-${i}`, f * 0.006 * speed, 0) * 60;
        const y =
          y0 * height +
          noise2D(`${seed}-ny-${i}`, 0, f * 0.006 * speed) * 60 -
          f * 0.4 * speed * z;
        const size = 60 + z * 150;
        const blur = Math.min(14, Math.abs(z - focus) * 22) * blurBoost;
        const color = NEON[Math.floor(rnd(`${seed}-c-${i}`) * NEON.length)];
        const rx =
          rr(`${seed}-rx-${i}`, 0, 360) +
          noise3D(`${seed}-r-${i}`, f * 0.01 * speed, 0, 0) * 90 +
          f * 0.6 * speed;
        const ry = rr(`${seed}-ry-${i}`, 0, 360) + f * 0.8 * speed;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x - size / 2,
              top: y - size / 2,
              filter: blur > 0.4 ? `blur(${blur}px)` : undefined,
              opacity: 0.35 + z * 0.65,
              zIndex: Math.round(z * 10),
            }}
          >
            <div style={{ perspective: 600 }}>
              <NeonCube
                size={size}
                color={color}
                rx={rx}
                ry={ry}
                border={size > 120 ? 7 : size > 90 ? 5 : 4}
                glow={1.3}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Large rotating cube centre frame with an icon inside and a sweeping orbit ring
export const HeroCube: React.FC<{
  size?: number;
  rx: number;
  ry: number;
  rz?: number;
  color?: string;
  Icon?: LucideIcon;
  iconColor?: string;
  iconScale?: number;
  variant?: "wire" | "solid";
  ring?: {
    angle: number;
    color: string;
    color2?: string;
    opacity?: number;
    tilt?: number;
  } | null;
  // 0..1 icon pop
  iconPop?: number;
}> = ({
  size = 300,
  rx,
  ry,
  rz = 0,
  color = colors.purple,
  Icon,
  iconColor = colors.white,
  iconScale = 1,
  variant = "wire",
  ring = null,
  iconPop = 1,
}) => {
  const iconSize = size * 0.38 * iconScale;
  const solidFace = (i: number): React.CSSProperties => ({
    background:
      i === 0 || i === 4
        ? "linear-gradient(145deg, rgba(150,120,255,0.95), rgba(95,60,220,0.95))"
        : "linear-gradient(145deg, rgba(110,80,235,0.95), rgba(70,40,170,0.95))",
    border: `2px solid rgba(220,210,255,0.85)`,
    borderRadius: size * 0.05,
    boxShadow: `inset 0 0 ${size * 0.15}px rgba(255,255,255,0.25), 0 0 20px rgba(123,92,240,0.6)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  const wireFace = (): React.CSSProperties => ({
    border: `4px solid ${color}`,
    boxShadow: `${neonGlow(color, 0.8)}, inset 0 0 14px ${color}`,
    borderRadius: 4,
  });
  return (
    <div
      style={{
        perspective: 1100,
        width: size,
        height: size,
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
        }}
      >
        {ring && (
          <div
            style={{
              position: "absolute",
              left: -size * 0.45,
              top: -size * 0.45,
              width: size * 1.9,
              height: size * 1.9,
              borderRadius: "50%",
              transform: `rotateX(${ring.tilt ?? 72}deg) rotateZ(${ring.angle}deg)`,
              background: `conic-gradient(from 0deg, transparent 0deg, ${ring.color} 60deg, ${ring.color2 ?? ring.color} 160deg, transparent 200deg)`,
              WebkitMask: `radial-gradient(circle, transparent ${size * 0.89}px, black ${size * 0.9}px, black ${size * 0.935}px, transparent ${size * 0.945}px)`,
              mask: `radial-gradient(circle, transparent ${size * 0.89}px, black ${size * 0.9}px, black ${size * 0.935}px, transparent ${size * 0.945}px)`,
              opacity: ring.opacity ?? 1,
              filter: `drop-shadow(0 0 8px ${ring.color})`,
            }}
          />
        )}
        <Box3D
          size={size}
          rx={rx}
          ry={ry}
          rz={rz}
          face={variant === "solid" ? solidFace : wireFace}
        >
          {variant === "solid"
            ? (i) =>
                i === 0 || i === 4 || i === 2 ? (
                  Icon ? (
                    <Icon
                      size={size * 0.34}
                      color={iconColor}
                      strokeWidth={1.6}
                      style={{ filter: `drop-shadow(0 0 10px ${iconColor})` }}
                    />
                  ) : (
                    <Img
                      src={staticFile(LOGOS.ravenMarkWhite)}
                      style={{ width: size * 0.42 }}
                    />
                  )
                ) : null
            : undefined}
        </Box3D>
      </div>
      {variant === "wire" && Icon && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `scale(${iconPop})`,
          }}
        >
          <Icon
            size={iconSize}
            color={iconColor}
            strokeWidth={1.7}
            style={{
              filter: `drop-shadow(0 0 12px ${iconColor}) drop-shadow(0 0 4px ${iconColor})`,
            }}
          />
        </div>
      )}
    </div>
  );
};

// Solid purple cubes tumbling through frame (fast ones blurred)
export const FallingCubes: React.FC<{ count?: number; seed?: string }> = ({
  count = 7,
  seed = "fall",
}) => {
  const f = useCurrentFrame();
  const { width, height } = useLayout();
  return (
    <AbsoluteFill>
      {range(count).map((i) => {
        const z = rnd(`${seed}-z-${i}`);
        const size = 90 + z * 140;
        const speed = 3 + z * 6;
        const side =
          i % 2 === 0
            ? rr(`${seed}-x-${i}`, 0.02, 0.3)
            : rr(`${seed}-x-${i}`, 0.62, 0.92);
        const x = side * width;
        const y0 = rr(`${seed}-y-${i}`, -0.3, 0.9) * height;
        const y = y0 + f * speed;
        const blur = z > 0.6 ? 7 : z < 0.3 ? 4 : 1.5;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              filter: blur ? `blur(${blur}px)` : undefined,
              opacity: 0.6 + z * 0.4,
            }}
          >
            <div style={{ perspective: 600 }}>
              <Box3D
                size={size}
                rx={rr(`${seed}-rx-${i}`, 0, 360) + f * 4}
                ry={rr(`${seed}-ry-${i}`, 0, 360) + f * 3}
                face={(k) => ({
                  background:
                    k % 3 === 0
                      ? "linear-gradient(135deg, #B9A3FF, #7B5CF0)"
                      : k % 3 === 1
                        ? "linear-gradient(135deg, #8F6BFF, #4B2FC0)"
                        : "linear-gradient(135deg, #FF2E86 0%, #7B5CF0 40%, #6A3FD8 100%)",
                  borderRadius: size * 0.06,
                })}
              />
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
