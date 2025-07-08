import type React from "react";
import { Composition } from "remotion";
import { RavenHouseDemo } from "./MyComp/RavenHouseDemo";
import { RavenHouseIntro } from "./MyComp/RavenHouseIntro";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RavenHouseIntro"
        component={RavenHouseIntro}
        durationInFrames={240}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
      <Composition
        id="RavenHouseDemo"
        component={RavenHouseDemo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
