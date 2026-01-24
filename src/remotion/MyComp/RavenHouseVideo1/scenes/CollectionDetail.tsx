import type React from "react";
import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import { colors, springConfigs } from "../styles";

loadFont();

export const CollectionDetail: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Screenshot fade in
  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle scale animation
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight glow pulse on stats area (simulated with overlay)
  const glowPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.3, 0.8]
  );

  // Stats counter animation
  const counterProgress = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text animation
  const textSpring = spring({
    frame: Math.max(0, frame - 20),
    fps,
    config: springConfigs.smooth,
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.backgroundGradient,
        fontFamily,
      }}
    >
      {/* Screenshot container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          opacity: fadeIn,
        }}
      >
        {/* Screenshot with rounded corners */}
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 80px ${colors.primaryGlow}`,
          }}
        >
          <Img
            src={staticFile("/img/video1/screenshot-collection.png")}
            style={{
              width: 1000,
              height: "auto",
              display: "block",
            }}
          />

          {/* Highlight glow overlay on stats bar area */}
          <div
            style={{
              position: "absolute",
              top: 180,
              left: 0,
              right: 0,
              height: 80,
              background: `linear-gradient(90deg, transparent 0%, ${colors.primaryGlow} 50%, transparent 100%)`,
              opacity: glowPulse,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

      {/* Stats counter overlay */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 100,
          display: "flex",
          flexDirection: "column",
          gap: 16,
          opacity: textSpring,
          transform: `translateX(${interpolate(textSpring, [0, 1], [50, 0])}px)`,
        }}
      >
        <StatCounter
          label="Floor Price"
          value={0.85}
          unit="USDC"
          progress={counterProgress}
        />
        <StatCounter
          label="Volume"
          value={234.5}
          unit="USDC"
          progress={counterProgress}
        />
        <StatCounter
          label="Items"
          value={10000}
          unit=""
          progress={counterProgress}
          isInteger
        />
      </div>

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          opacity: textSpring,
          transform: `translateY(${interpolate(textSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 42,
            fontWeight: 700,
            color: colors.text,
            textShadow: `0 0 40px ${colors.primaryGlow}`,
          }}
        >
          Real-Time Marketplace
        </div>
        <div
          style={{
            width: 100,
            height: 4,
            background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`,
            borderRadius: 2,
            marginTop: 12,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

// Stat counter component
const StatCounter: React.FC<{
  label: string;
  value: number;
  unit: string;
  progress: number;
  isInteger?: boolean;
}> = ({ label, value, unit, progress, isInteger }) => {
  const displayValue = isInteger
    ? Math.floor(value * progress)
    : (value * progress).toFixed(2);

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(10px)",
        borderRadius: 12,
        padding: "12px 20px",
        border: `1px solid ${colors.border}`,
      }}
    >
      <div style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontSize: 24, fontWeight: 700, color: colors.text }}>
        {displayValue} {unit}
      </div>
    </div>
  );
};
