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

export const NFTTrading: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Screenshot animation
  const slideSpring = spring({
    frame,
    fps,
    config: springConfigs.snappy,
    durationInFrames: 35,
  });
  const translateX = interpolate(slideSpring, [0, 1], [-400, 0]);

  // Subtle scale
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Shield icon animation
  const shieldSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: springConfigs.bouncy,
  });

  // Text animation
  const textOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textY = interpolate(frame, [25, 45], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
          transform: `translate(-50%, -50%) translateX(${translateX}px) scale(${scale})`,
        }}
      >
        <div
          style={{
            position: "relative",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px ${colors.primaryGlow}`,
          }}
        >
          <Img
            src={staticFile("/img/video1/screenshot-nft.png")}
            style={{
              width: 900,
              height: "auto",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* Shield icon with privacy emphasis */}
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 120,
          transform: `scale(${shieldSpring})`,
          opacity: shieldSpring,
        }}
      >
        <div
          style={{
            width: 80,
            height: 80,
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: `0 0 40px ${colors.primaryGlow}`,
          }}
        >
          {/* Shield SVG */}
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke={colors.text}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: 12,
            fontSize: 14,
            fontWeight: 600,
            color: colors.textMuted,
          }}
        >
          Private
        </div>
      </div>

      {/* Text overlay */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
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
          Zero-Knowledge Trading
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
