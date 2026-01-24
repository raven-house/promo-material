import type React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";

import { LogoReveal } from "./scenes/LogoReveal";
import { Tagline } from "./scenes/Tagline";
import { HomePageShowcase } from "./scenes/HomePageShowcase";
import { CollectionDetail } from "./scenes/CollectionDetail";
import { NFTTrading } from "./scenes/NFTTrading";
import { Gallery3D } from "./scenes/Gallery3D";
import { FeatureMontage } from "./scenes/FeatureMontage";
import { ClosingCTA } from "./scenes/ClosingCTA";

// Scene durations in frames (at 30fps)
const SCENE_1_DURATION = 90; // Logo Reveal: 3 seconds
const SCENE_2_DURATION = 90; // Tagline: 3 seconds
const SCENE_3_DURATION = 90; // Home Page: 3 seconds
const SCENE_4_DURATION = 120; // Collection Detail: 4 seconds (more time for stat counters)
const SCENE_5_DURATION = 90; // NFT Trading: 3 seconds
const SCENE_6_DURATION = 120; // Gallery 3D: 4 seconds (hero moment)
const SCENE_7_DURATION = 150; // Feature Montage: 5 seconds (more time for each slide)
const SCENE_8_DURATION = 90; // Closing CTA: 3 seconds

// Transition durations
const FADE_DURATION = 15;
const SLIDE_DURATION = 20;

export const RavenHouseVideo1: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, #1a1025 0%, #0a0a0a 70%)",
      }}
    >
      <TransitionSeries>
        {/* Scene 1: Logo Reveal */}
        <TransitionSeries.Sequence durationInFrames={SCENE_1_DURATION}>
          <LogoReveal />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* Scene 2: Tagline */}
        <TransitionSeries.Sequence durationInFrames={SCENE_2_DURATION}>
          <Tagline />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={linearTiming({ durationInFrames: SLIDE_DURATION })}
        />

        {/* Scene 3: Home Page Showcase */}
        <TransitionSeries.Sequence durationInFrames={SCENE_3_DURATION}>
          <HomePageShowcase />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* Scene 4: Collection Detail */}
        <TransitionSeries.Sequence durationInFrames={SCENE_4_DURATION}>
          <CollectionDetail />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-left" })}
          timing={linearTiming({ durationInFrames: SLIDE_DURATION })}
        />

        {/* Scene 5: NFT Trading */}
        <TransitionSeries.Sequence durationInFrames={SCENE_5_DURATION}>
          <NFTTrading />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* Scene 6: 3D Gallery - Hero Moment */}
        <TransitionSeries.Sequence durationInFrames={SCENE_6_DURATION}>
          <Gallery3D />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* Scene 7: Feature Montage */}
        <TransitionSeries.Sequence durationInFrames={SCENE_7_DURATION}>
          <FeatureMontage />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: FADE_DURATION })}
        />

        {/* Scene 8: Closing CTA */}
        <TransitionSeries.Sequence durationInFrames={SCENE_8_DURATION}>
          <ClosingCTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
