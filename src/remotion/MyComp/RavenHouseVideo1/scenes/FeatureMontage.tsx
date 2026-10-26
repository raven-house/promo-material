import type React from "react";
import {
  AbsoluteFill,
  Img,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import { colors, springConfigs } from "../styles";

loadFont();

// Each cut is 50 frames (~1.7 seconds) for better visibility
const CUT_DURATION = 50;

const FeatureSlide: React.FC<{
  image: string;
  label: string;
}> = ({ image, label }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quick scale-in animation
  const scaleSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 150 },
    durationInFrames: 20,
  });
  const scale = interpolate(scaleSpring, [0, 1], [0.8, 1]);
  const opacity = interpolate(scaleSpring, [0, 1], [0, 1]);

  // Text flash animation
  const textScale = spring({
    frame: Math.max(0, frame - 5),
    fps,
    config: springConfigs.snappy,
    durationInFrames: 15,
  });

  return (
    <AbsoluteFill
      style={{
        background: colors.backgroundGradient,
        fontFamily,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Screenshot */}
      <div
        style={{
          transform: `scale(${scale})`,
          opacity,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: `0 20px 40px -10px rgba(0, 0, 0, 0.5), 0 0 40px ${colors.primaryGlow}`,
        }}
      >
        <Img
          src={staticFile(image)}
          style={{
            width: 700,
            height: "auto",
            display: "block",
          }}
        />
      </div>

      {/* Label flash */}
      <div
        style={{
          position: "absolute",
          bottom: 150,
          left: "50%",
          transform: `translateX(-50%) scale(${textScale})`,
          opacity: textScale,
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: colors.text,
            textShadow: `
              0 0 30px ${colors.primary},
              0 0 60px ${colors.primaryGlow}
            `,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const FeatureMontage: React.FC = () => {
  return (
    <AbsoluteFill>
      {/* Creation wizard - "Create" */}
      <Sequence durationInFrames={CUT_DURATION} premountFor={5}>
        <FeatureSlide
          image="/img/video1/screenshot-create.png"
          label="Create"
        />
      </Sequence>

      {/* Rewards dashboard - "Earn" */}
      <Sequence from={CUT_DURATION} durationInFrames={CUT_DURATION} premountFor={5}>
        <FeatureSlide
          image="/img/video1/rewards.png"
          label="Earn"
        />
      </Sequence>

      {/* Back to collections - "Trade" */}
      <Sequence from={CUT_DURATION * 2} durationInFrames={CUT_DURATION} premountFor={5}>
        <FeatureSlide
          image="/img/video1/screenshot-collection1.png"
          label="Trade"
        />
      </Sequence>
    </AbsoluteFill>
  );
};
