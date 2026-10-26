import { CameraMotionBlur } from "@remotion/motion-blur";
import type React from "react";
import { AbsoluteFill, Sequence } from "remotion";

// Show children only in [from, to) of the parent timeline; inside, frame 0 = `from`
export const Word: React.FC<{
  from: number;
  to: number;
  children: React.ReactNode;
}> = ({ from, to, children }) => (
  <Sequence from={from} durationInFrames={Math.max(1, to - from)} layout="none">
    {children}
  </Sequence>
);

// Camera motion blur only while a whip move is running (it re-renders children per sample)
export const WhipBlur: React.FC<{
  active: boolean;
  children: React.ReactNode;
  samples?: number;
}> = ({ active, children, samples = 8 }) =>
  active ? (
    <CameraMotionBlur shutterAngle={180} samples={samples}>
      {children}
    </CameraMotionBlur>
  ) : (
    <AbsoluteFill>{children}</AbsoluteFill>
  );

// Dark grey-violet stage used behind tilted app screens
export const UI_STAGE =
  "radial-gradient(ellipse at 50% 40%, #3a3447 0%, #262130 55%, #16121f 100%)";
