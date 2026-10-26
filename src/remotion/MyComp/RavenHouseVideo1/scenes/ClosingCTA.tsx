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

export const ClosingCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Logo returns to center, larger
  const logoSpring = spring({
    frame,
    fps,
    config: springConfigs.smooth,
    durationInFrames: 40,
  });
  const logoScale = interpolate(logoSpring, [0, 1], [0.5, 1]);
  const logoOpacity = interpolate(logoSpring, [0, 1], [0, 1]);

  // Subtle pulse animation on logo
  const pulseScale = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [1, 1.03]
  );

  // Website URL animation
  const urlSpring = spring({
    frame: Math.max(0, frame - 25),
    fps,
    config: springConfigs.snappy,
  });

  // Tagline animation
  const taglineSpring = spring({
    frame: Math.max(0, frame - 40),
    fps,
    config: springConfigs.smooth,
  });

  // Fade to black last 15 frames
  const fadeOutStart = durationInFrames - 15;
  const fadeOut = interpolate(
    frame,
    [fadeOutStart, durationInFrames],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Glow effect
  const glowIntensity = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.4, 0.8]
  );

  return (
    <AbsoluteFill
      style={{
        background: colors.backgroundGradient,
        fontFamily,
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 600,
          height: 600,
          background: `radial-gradient(circle, ${colors.primaryGlow} 0%, transparent 70%)`,
          opacity: glowIntensity * 0.5,
          filter: "blur(40px)",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          gap: 30,
        }}
      >
        {/* Logo with pulse */}
        <div
          style={{
            transform: `scale(${logoScale * pulseScale})`,
            opacity: logoOpacity,
            filter: `drop-shadow(0 0 ${40 * glowIntensity}px ${colors.primary})`,
          }}
        >
          <Img
            src={staticFile("/img/video1/logo.svg")}
            style={{
              width: 350,
              height: "auto",
            }}
          />
        </div>

        {/* Website URL */}
        <div
          style={{
            opacity: urlSpring,
            transform: `translateY(${interpolate(urlSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 600,
              color: colors.text,
              letterSpacing: 3,
              textShadow: `0 0 20px ${colors.primaryGlow}`,
            }}
          >
            ravenhouse.xyz
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            opacity: taglineSpring,
            transform: `translateY(${interpolate(taglineSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: colors.textMuted,
              letterSpacing: 2,
            }}
          >
            Where Privacy Meets Art
          </div>
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: interpolate(taglineSpring, [0, 1], [0, 200]),
            height: 2,
            background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.accent}, transparent)`,
            marginTop: 10,
          }}
        />
      </div>

      {/* Aztec badge bottom corner */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 60,
          display: "flex",
          alignItems: "center",
          gap: 10,
          opacity: taglineSpring * 0.7,
        }}
      >
        <span style={{ fontSize: 12, color: colors.textMuted }}>
          Powered by
        </span>
        <Img
          src={staticFile("/img/video1/aztec-logo.png")}
          style={{ height: 24, width: "auto" }}
        />
      </div>

      {/* Fade to black overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: colors.background,
          opacity: fadeOut,
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};
