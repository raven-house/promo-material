import type React from "react";
import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
  spring,
  useVideoConfig,
} from "remotion";

export const SelectCollectionTypeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  const normalHighlight = interpolate(
    frame,
    [60, 90, 110, 111],
    [0, 1, 1, 0.3],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    },
  );

  const voucherHighlight = interpolate(
    frame,
    [120, 140, 150, 160],
    [0, 1, 1, 1],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    },
  );

  const finalEmphasis = spring({
    frame: frame - 240,
    fps,
    config: {
      damping: 12,
      stiffness: 80,
    },
  });

  const voucherPulse = interpolate(frame, [160, 180, 200], [1, 1.05, 1.02], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("audio/scene3-select-type.mp3")} />

      <Img
        src={staticFile("img/select-collection-type.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: fadeIn,
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 509,
          left: 390,
          width: 250,
          height: 50,
          borderRadius: 25,
          border: `3px solid rgba(139, 92, 246, ${normalHighlight})`,
          boxShadow: `0 0 ${20 + normalHighlight * 30}px rgba(139, 92, 246, ${normalHighlight * 0.6})`,
          backgroundColor: `rgba(139, 92, 246, ${normalHighlight * 0.1})`,
          transform: `scale(${1 + normalHighlight * 0.05})`,
          transition: "all 0.3s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 509,
          left: 640,
          width: 250,
          height: 50,
          borderRadius: 25,
          border: `3px solid rgba(34, 197, 94, ${voucherHighlight})`,
          boxShadow: `0 0 ${30 + voucherHighlight * 40}px rgba(34, 197, 94, ${voucherHighlight * 0.8})`,
          backgroundColor: `rgba(34, 197, 94, ${voucherHighlight * 0.15})`,
          transform: `scale(${voucherPulse + finalEmphasis * 0.03})`,
          transition: "all 0.3s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 492,
          left: 880,
          backgroundColor: "#ef4444",
          color: "white",
          fontSize: 14,
          fontWeight: "bold",
          padding: "6px 12px",
          borderRadius: 12,
          opacity: voucherHighlight,
          transform: `scale(${1 + finalEmphasis * 0.1})`,
          boxShadow: "0 4px 15px rgba(239, 68, 68, 0.4)",
        }}
      >
        NEW
      </div>

      <div
        style={{
          position: "absolute",
          top: 556,
          left: 759,
          fontSize: 36,
          color: "#22c55e",
          opacity: voucherHighlight,
          transform: `translateY(${-10 + Math.sin(frame * 0.2) * 5}px)`,
          textShadow: "0 0 20px rgba(34, 197, 94, 0.8)",
          filter: `drop-shadow(0 0 10px rgba(34, 197, 94, ${voucherHighlight}))`,
        }}
      >
        ↑
      </div>
    </AbsoluteFill>
  );
};
