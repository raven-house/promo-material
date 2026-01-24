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
import { colors, springConfigs } from "../styles";

export const LogoReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo scale animation: start at 0.8, ease to 1.0
  const scaleSpring = spring({
    frame,
    fps,
    config: springConfigs.logoReveal,
    durationInFrames: 40,
  });
  const logoScale = interpolate(scaleSpring, [0, 1], [0.8, 1]);

  // Opacity: fade in over 20 frames
  const logoOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Subtle glow pulse
  const glowIntensity = interpolate(
    Math.sin(frame * 0.1),
    [-1, 1],
    [0.3, 0.6]
  );

  // Particle effect - floating dots
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: ((i * 137) % 100) - 50, // Distribute across screen
    y: ((i * 89) % 100) - 50,
    size: 2 + (i % 3),
    speed: 0.3 + (i % 5) * 0.1,
    delay: i * 3,
  }));

  return (
    <AbsoluteFill
      style={{
        background: colors.backgroundGradient,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Particle effect behind logo */}
      {particles.map((particle) => {
        const particleOpacity = interpolate(
          frame - particle.delay,
          [0, 20, 60, 80],
          [0, 0.4, 0.4, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const particleY =
          particle.y - (frame - particle.delay) * particle.speed * 0.5;

        return (
          <div
            key={particle.id}
            style={{
              position: "absolute",
              left: `${50 + particle.x * 0.4}%`,
              top: `${50 + particleY * 0.4}%`,
              width: particle.size,
              height: particle.size,
              borderRadius: "50%",
              backgroundColor: colors.primary,
              opacity: particleOpacity,
              boxShadow: `0 0 ${particle.size * 2}px ${colors.primaryGlow}`,
            }}
          />
        );
      })}

      {/* Logo with glow effect */}
      <div
        style={{
          transform: `scale(${logoScale})`,
          opacity: logoOpacity,
          filter: `drop-shadow(0 0 ${30 * glowIntensity}px ${colors.primary}) drop-shadow(0 0 ${60 * glowIntensity}px ${colors.primaryGlow})`,
        }}
      >
        <Img
          src={staticFile("/img/video1/logo.svg")}
          style={{
            width: 400,
            height: "auto",
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
