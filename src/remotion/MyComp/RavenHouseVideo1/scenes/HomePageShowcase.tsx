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

export const HomePageShowcase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Screenshot slide in from right with spring
  const slideSpring = spring({
    frame,
    fps,
    config: springConfigs.snappy,
    durationInFrames: 40,
  });
  const translateX = interpolate(slideSpring, [0, 1], [400, 0]);

  // Subtle 3D perspective tilt
  const rotateY = -5;

  // Subtle zoom effect: scale 1.0 to 1.02
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.02], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Text overlay animation
  const textOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const textTranslateY = interpolate(frame, [20, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.backgroundGradient,
        fontFamily,
        perspective: 1000,
      }}
    >
      {/* Browser mockup with screenshot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) translateX(${translateX}px) rotateY(${rotateY}deg) scale(${scale})`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Browser frame */}
        <div
          style={{
            background: colors.border,
            borderRadius: 12,
            padding: 8,
            boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 60px ${colors.primaryGlow}`,
          }}
        >
          {/* Browser header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              background: colors.background,
              borderRadius: "8px 8px 0 0",
            }}
          >
            <div style={{ display: "flex", gap: 6 }}>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#ff5f57",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#febc2e",
                }}
              />
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "#28c840",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                marginLeft: 40,
                background: colors.border,
                borderRadius: 6,
                padding: "6px 16px",
                color: colors.textMuted,
                fontSize: 12,
              }}
            >
              raven.house
            </div>
          </div>

          {/* Screenshot */}
          <Img
            src={staticFile("/img/video1/screenshot-home.png")}
            style={{
              width: 900,
              height: "auto",
              display: "block",
              borderRadius: "0 0 4px 4px",
            }}
          />
        </div>
      </div>

      {/* Text overlay bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          left: 80,
          opacity: textOpacity,
          transform: `translateY(${textTranslateY}px)`,
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
          Discover Collections
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
