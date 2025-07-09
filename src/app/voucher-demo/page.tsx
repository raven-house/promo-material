"use client";

import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { Player } from "@remotion/player";
import {
  CREATE_BUTTON_SOUND_IN_SECONDS,
  DURATION_IN_FRAMES_INTRO,
  FILL_DETAILS_SOUND_IN_SECONDS,
  INTRO_SOUND_IN_SECONDS,
  SELECT_COLLECTION_TYPE_IN_SECONDS,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../../types/constants";
import { TopCollectionsScene } from "../../remotion/MyComp/TopCollectionsScene";
import { CreateCollectionClickScene } from "../../remotion/MyComp/CreateCollectionClickScene";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { fade } from "@remotion/transitions/fade";
import { SelectCollectionTypeScene } from "../../remotion/MyComp/SelectCollectionTypeScene";
import { RavenHouseIntro } from "../../remotion/MyComp/RavenHouseIntro";
import { FillCollectionDetailsScene } from "../../remotion/MyComp/FillCollectionDetailsScene";

const TRANSITION_TIMING = 20;
const component = () => (
  <div className="p-20 w-screen h-screen bg-red-500">
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={DURATION_IN_FRAMES_INTRO}>
        <RavenHouseIntro />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={clockWipe({ width: VIDEO_WIDTH, height: VIDEO_HEIGHT })}
        timing={linearTiming({ durationInFrames: TRANSITION_TIMING })}
      />

      <TransitionSeries.Sequence
        durationInFrames={
          VIDEO_FPS * INTRO_SOUND_IN_SECONDS + TRANSITION_TIMING
        }
      >
        <TopCollectionsScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={clockWipe({ width: VIDEO_WIDTH, height: VIDEO_HEIGHT })}
        timing={linearTiming({ durationInFrames: TRANSITION_TIMING })}
      />
      <TransitionSeries.Sequence
        durationInFrames={
          VIDEO_FPS * CREATE_BUTTON_SOUND_IN_SECONDS + TRANSITION_TIMING
        }
      >
        <CreateCollectionClickScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_TIMING })}
      />

      <TransitionSeries.Sequence
        durationInFrames={
          VIDEO_FPS * SELECT_COLLECTION_TYPE_IN_SECONDS + TRANSITION_TIMING
        }
      >
        <SelectCollectionTypeScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Sequence
        durationInFrames={
          VIDEO_FPS * FILL_DETAILS_SOUND_IN_SECONDS + TRANSITION_TIMING
        }
      >
        <FillCollectionDetailsScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  </div>
);

export default function VoucherDemo() {
  return (
    <div>
      <div className="max-w-screen-lg mt-20 m-auto mb-5">
        <Player
          component={component}
          inputProps={{}}
          durationInFrames={
            DURATION_IN_FRAMES_INTRO +
            VIDEO_FPS * INTRO_SOUND_IN_SECONDS +
            VIDEO_FPS * CREATE_BUTTON_SOUND_IN_SECONDS +
            VIDEO_FPS * SELECT_COLLECTION_TYPE_IN_SECONDS +
            VIDEO_FPS * FILL_DETAILS_SOUND_IN_SECONDS
          }
          fps={VIDEO_FPS}
          compositionHeight={VIDEO_HEIGHT}
          compositionWidth={VIDEO_WIDTH}
          style={{
            width: "100%",
          }}
          controls
          autoPlay
          loop
        />
      </div>
    </div>
  );
}
