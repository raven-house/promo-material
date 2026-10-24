import type React from "react";
import { Composition, Folder } from "remotion";
import { RavenHouseDemo } from "./MyComp/RavenHouseDemo";
import { RavenHouseIntro } from "./MyComp/RavenHouseIntro";
import { TopCollectionsScene } from "./MyComp/TopCollectionsScene";
import { CreateCollectionClickScene } from "./MyComp/CreateCollectionClickScene";
import { SelectCollectionTypeScene } from "./MyComp/SelectCollectionTypeScene";
import { RavenHouseVideo1 } from "./MyComp/RavenHouseVideo1";
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
  VIDEO1_DURATION_IN_FRAMES,
  VIDEO1_WIDTH,
  VIDEO1_HEIGHT,
} from "../../types/constants";
import { FillCollectionDetailsScene } from "./MyComp/FillCollectionDetailsScene";
import { ScenePreview, WhyPrivateNFTs, wpnDefaultProps, wpnSchema } from "./WhyPrivateNFTs";
import { PREVIEWS } from "./WhyPrivateNFTs/components/previews";
import type { ShotId } from "./WhyPrivateNFTs/timeline";
import { DURATION as WPN_DURATION, FPS as WPN_FPS, SHOTS as WPN_SHOTS } from "./WhyPrivateNFTs/timeline";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="WhyPrivateNFTs"
        component={WhyPrivateNFTs}
        schema={wpnSchema}
        defaultProps={wpnDefaultProps}
        durationInFrames={WPN_DURATION}
        fps={WPN_FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="WhyPrivateNFTsVertical"
        component={WhyPrivateNFTs}
        schema={wpnSchema}
        defaultProps={wpnDefaultProps}
        durationInFrames={WPN_DURATION}
        fps={WPN_FPS}
        width={1080}
        height={1920}
      />
      <Folder name="WhyPrivateNFTs">
        {(Object.keys(WPN_SHOTS) as ShotId[]).map((id) => (
          <Composition
            key={id}
            id={`WPN-${id}`}
            component={ScenePreview}
            defaultProps={{ id }}
            durationInFrames={WPN_SHOTS[id].to - WPN_SHOTS[id].from}
            fps={WPN_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>
      <Folder name="WPN-Components">
        {Object.entries(PREVIEWS).map(([name, p]) => (
          <Composition
            key={name}
            id={`WPN-${name}`}
            component={p.component}
            durationInFrames={p.duration}
            fps={WPN_FPS}
            width={1920}
            height={1080}
          />
        ))}
      </Folder>
      <Composition
        id="RavenHouseVideo1"
        component={RavenHouseVideo1}
        durationInFrames={VIDEO1_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO1_WIDTH}
        height={VIDEO1_HEIGHT}
      />

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
