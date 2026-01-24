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

export const Gallery3D: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // DRAMATIC zoom through black entrance
  const zoomSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 80 },
    durationInFrames: 45,
  });
  const zoomScale = interpolate(zoomSpring, [0, 1], [3, 1]);
  const zoomOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ken Burns effect: slow pan across image
  const panX = interpolate(frame, [0, durationInFrames], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panY = interpolate(frame, [0, durationInFrames], [0, -20], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const panScale = interpolate(frame, [0, durationInFrames], [1.1, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Floating particles effect
  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: ((i * 73) % 100),
    y: ((i * 47) % 100),
    size: 2 + (i % 4),
    speed: 0.2 + (i % 6) * 0.1,
    delay: i * 2,
  }));

  // Text animation
  const textSpring = spring({
    frame: Math.max(0, frame - 50),
    fps,
    config: springConfigs.smooth,
  });

  // Glow intensity pulse
  const glowPulse = interpolate(
    Math.sin(frame * 0.08),
    [-1, 1],
    [0.5, 1]
  );

  return (
    <AbsoluteFill
      style={{
        background: colors.background,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Background gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: colors.backgroundGradient,
          opacity: 0.8,
        }}
      />

      {/* Floating particles */}
      {particles.map((particle) => {
        const particleFrame = frame - particle.delay;
        const particleY = particle.y - particleFrame * particle.speed * 0.3;
        const particleOpacity = interpolate(
          particleFrame,
          [0, 30, durationInFrames - 30, durationInFrames],
          [0, 0.6, 0.6, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: `${particle.x}%`,
              top: `${particleY}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              background: particle.id % 2 === 0 ? colors.primary : colors.accent,
              opacity: particleOpacity,
              boxShadow: `0 0 ${particle.size * 3}px ${particle.id % 2 === 0 ? colors.primary : colors.accent}`,
            }}
          />
        );
      })}

      {/* Main screenshot with parallax layers effect */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${zoomScale})`,
          opacity: zoomOpacity,
        }}
      >
        {/* Outer glow layer */}
        <div
          style={{
            position: "absolute",
            inset: -40,
            background: `radial-gradient(ellipse at center, ${colors.primaryGlow} 0%, transparent 70%)`,
            opacity: glowPulse,
            filter: "blur(20px)",
          }}
        />

        {/* Screenshot container with Ken Burns */}
        <div
          style={{
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: `
              0 0 80px ${colors.primaryGlow},
              0 0 120px rgba(244, 114, 182, 0.2),
              0 50px 100px -20px rgba(0, 0, 0, 0.7)
            `,
          }}
        >
          <div
            style={{
              transform: `translate(${panX}px, ${panY}px) scale(${panScale})`,
              transformOrigin: "center center",
            }}
          >
            <Img
              src={staticFile("/img/video1/screenshot-gallery.png")}
              style={{
                width: 1100,
                height: "auto",
                display: "block",
              }}
            />
          </div>
        </div>

        {/* Depth layers - fake 3D effect */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: -30,
            width: 60,
            height: "80%",
            background: `linear-gradient(90deg, ${colors.primary}20, transparent)`,
            transform: `translateX(${panX * 0.5}px)`,
            filter: "blur(10px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 20,
            right: -30,
            width: 60,
            height: "80%",
            background: `linear-gradient(-90deg, ${colors.accent}20, transparent)`,
            transform: `translateX(${-panX * 0.5}px)`,
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* Hero text */}
      <div
        style={{
          position: "absolute",
          bottom: 100,
          left: 0,
          right: 0,
          textAlign: "center",
          opacity: textSpring,
          transform: `translateY(${interpolate(textSpring, [0, 1], [40, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontWeight: 700,
            color: colors.text,
            textShadow: `
              0 0 40px ${colors.primaryGlow},
              0 0 80px ${colors.primaryGlow}
            `,
            letterSpacing: 2,
          }}
        >
          Immersive 3D Galleries
        </div>
        <div
          style={{
            width: 200,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${colors.primary}, ${colors.accent}, transparent)`,
            borderRadius: 2,
            margin: "20px auto 0",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
