import type React from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../theme";

// Purple pill with a growing fill of scrolling cyan diagonal stripes
export const LoadingBar: React.FC<{
  progress: number;
  width?: number;
  height?: number;
  opacity?: number;
  style?: React.CSSProperties;
}> = ({ progress, width = 520, height = 52, opacity = 1, style }) => {
  const f = useCurrentFrame();
  const p = Math.max(0, Math.min(1, progress));
  return (
    <div
      style={{
        width,
        height,
        borderRadius: height / 2,
        background: colors.purple,
        boxShadow: `0 0 24px rgba(123,92,240,0.55)`,
        overflow: "hidden",
        position: "relative",
        opacity,
        ...style,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: Math.max(height, width * p),
          borderRadius: height / 2,
          border: `4px solid #E9FDFF`,
          backgroundColor: "#E9FDFF",
          backgroundImage: `repeating-linear-gradient(120deg, ${colors.cyan} 0 14px, #E9FDFF 14px 26px)`,
          backgroundPosition: `${f * 2.5}px 0`,
          boxShadow: `0 0 18px ${colors.cyan}`,
        }}
      />
    </div>
  );
};
