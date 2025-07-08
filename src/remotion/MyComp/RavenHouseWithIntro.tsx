import type React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { RavenHouseIntro } from "./RavenHouseIntro";

interface RavenHouseWithIntroProps {
  children?: React.ReactNode;
  introDuration?: number;
}

export const RavenHouseWithIntro: React.FC<RavenHouseWithIntroProps> = ({
  children,
  introDuration = 240,
}) => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={introDuration}>
        <RavenHouseIntro />
      </Sequence>

      {children && <Sequence from={introDuration}>{children}</Sequence>}
    </AbsoluteFill>
  );
};
