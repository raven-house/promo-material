import type React from "react";
import { Composition } from "remotion";
import { RavenHouseDemo } from "./MyComp/RavenHouseDemo";
import { RavenHouseIntro } from "./MyComp/RavenHouseIntro";
import { TopCollectionsScene } from "./MyComp/TopCollectionsScene";
import { CreateCollectionClickScene } from "./MyComp/CreateCollectionClickScene";
import { SelectCollectionTypeScene } from "./MyComp/SelectCollectionTypeScene";
import {
  CREATE_BUTTON_SOUND_IN_SECONDS,
  DURATION_IN_FRAMES,
  DURATION_IN_FRAMES_INTRO,
  FILL_DETAILS_SOUND_IN_SECONDS,
  INTRO_SOUND_IN_SECONDS,
  SELECT_COLLECTION_TYPE_IN_SECONDS,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { FillCollectionDetailsScene } from "./MyComp/FillCollectionDetailsScene";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="RavenHouseIntro"
        component={RavenHouseIntro}
        durationInFrames={DURATION_IN_FRAMES_INTRO}
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

      <Composition
        id="TopCollections"
        component={TopCollectionsScene}
        durationInFrames={VIDEO_FPS * INTRO_SOUND_IN_SECONDS}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="createButton"
        component={CreateCollectionClickScene}
        durationInFrames={VIDEO_FPS * CREATE_BUTTON_SOUND_IN_SECONDS}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="selectCollectionType"
        component={SelectCollectionTypeScene}
        durationInFrames={VIDEO_FPS * SELECT_COLLECTION_TYPE_IN_SECONDS}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />

      <Composition
        id="fillDetails"
        component={FillCollectionDetailsScene}
        durationInFrames={VIDEO_FPS * FILL_DETAILS_SOUND_IN_SECONDS}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
      />
    </>
  );
};
