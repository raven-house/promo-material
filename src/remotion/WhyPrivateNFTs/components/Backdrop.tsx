import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { BACKGROUND } from "../theme";

export const Backdrop: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill
    style={{ background: BACKGROUND, overflow: "hidden", ...style }}
  >
    {children}
  </AbsoluteFill>
);

// SVG feTurbulence grain, new seed every frame, 4% opacity
export const FilmGrain: React.FC<{ opacity?: number }> = ({
  opacity = 0.04,
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill
      style={{ pointerEvents: "none", opacity, mixBlendMode: "screen" }}
    >
      <svg width="100%" height="100%">
        <filter id={`grain-${frame}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed={frame % 97}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${frame})`} />
      </svg>
    </AbsoluteFill>
  );
};

export const Vignette: React.FC<{ strength?: number }> = ({
  strength = 0.55,
}) => (
  <AbsoluteFill
    style={{
      pointerEvents: "none",
      background: `radial-gradient(ellipse at center, rgba(0,0,0,0) 55%, rgba(4,2,12,${strength}) 100%)`,
    }}
  />
);

export const Center: React.FC<{
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ children, style }) => (
  <AbsoluteFill
    style={{ justifyContent: "center", alignItems: "center", ...style }}
  >
    {children}
  </AbsoluteFill>
);
