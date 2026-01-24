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

const MAIN_TEXT = "Privacy-First NFT Marketplace";
const SUBTEXT = "Built on Aztec Network";
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;

// Typewriter helper
const getTypedText = (frame: number, text: string, charFrames: number): string => {
  const typedChars = Math.floor(frame / charFrames);
  return text.slice(0, Math.min(typedChars, text.length));
};

// Cursor component
const Cursor: React.FC<{ frame: number; show: boolean }> = ({ frame, show }) => {
  if (!show) return null;
  const opacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <span style={{ opacity, color: colors.primary }}>|</span>;
};

export const Tagline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation - scale down and move to top-left
  const logoTransition = spring({
    frame,
    fps,
    config: springConfigs.smooth,
    durationInFrames: 30,
  });

  const logoScale = interpolate(logoTransition, [0, 1], [1, 0.3]);
  const logoX = interpolate(logoTransition, [0, 1], [0, -750]);
  const logoY = interpolate(logoTransition, [0, 1], [0, -400]);
  const logoOpacity = interpolate(logoTransition, [0, 0.5, 1], [1, 1, 0.9]);

  // Typewriter effect starts after logo moves
  const typewriterStart = 25;
  const typewriterFrame = Math.max(0, frame - typewriterStart);
  const typedText = getTypedText(typewriterFrame, MAIN_TEXT, CHAR_FRAMES);
  const isTypingComplete = typedText.length >= MAIN_TEXT.length;

  // Subtext fade in after typing completes
  const subtextDelay = typewriterStart + MAIN_TEXT.length * CHAR_FRAMES + 10;
  const subtextOpacity = interpolate(
    frame - subtextDelay,
    [0, 20],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Aztec badge animation
  const badgeSpring = spring({
    frame: Math.max(0, frame - subtextDelay - 10),
    fps,
    config: springConfigs.snappy,
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.backgroundGradient,
        fontFamily,
      }}
    >
      {/* Small logo in top-left */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 60,
          transform: `translate(${logoX}px, ${logoY}px) scale(${logoScale})`,
          opacity: logoOpacity,
          transformOrigin: "center center",
        }}
      >
        <Img
          src={staticFile("/img/video1/logo.svg")}
          style={{ height: 40, width: "auto" }}
        />
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          padding: 40,
        }}
      >
        {/* Main tagline with typewriter */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: colors.text,
            textAlign: "center",
            lineHeight: 1.2,
          }}
        >
          <span>{typedText}</span>
          <Cursor frame={typewriterFrame} show={!isTypingComplete || frame % 60 < 30} />
        </div>

        {/* Subtext with Aztec badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 24,
            opacity: subtextOpacity,
          }}
        >
          <span
            style={{
              fontSize: 24,
              color: colors.textMuted,
            }}
          >
            {SUBTEXT}
          </span>
          <div
            style={{
              transform: `scale(${badgeSpring})`,
              opacity: badgeSpring,
            }}
          >
            <Img
              src={staticFile("/img/video1/aztec-logo.png")}
              style={{ height: 28, width: "auto" }}
            />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
