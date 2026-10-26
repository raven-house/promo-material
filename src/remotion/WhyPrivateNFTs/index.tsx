import type React from "react";
import {
  AbsoluteFill,
  Audio,
  getStaticFiles,
  interpolate,
  Sequence,
  staticFile,
} from "remotion";
import { z } from "zod";
import { MUSIC, SFX } from "./assets";
import { FilmGrain, Vignette } from "./components/Backdrop";
import { S01_Welcome } from "./scenes/S01_Welcome";
import { S02_YourArt } from "./scenes/S02_YourArt";
import { S03_Visible } from "./scenes/S03_Visible";
import { S04_Forever } from "./scenes/S04_Forever";
import { S05_GoPrivate } from "./scenes/S05_GoPrivate";
import { S06_Marketplace } from "./scenes/S06_Marketplace";
import { S07_PoweredBy } from "./scenes/S07_PoweredBy";
import { S08_Introducing } from "./scenes/S08_Introducing";
import { S09_LogoRing } from "./scenes/S09_LogoRing";
import { S10_SingleClick } from "./scenes/S10_SingleClick";
import { S11_Buy } from "./scenes/S11_Buy";
import { S12_BuyFlow } from "./scenes/S12_BuyFlow";
import { S13_KeepPrivate } from "./scenes/S13_KeepPrivate";
import { S14_Sell } from "./scenes/S14_Sell";
import { S15_SellFlow } from "./scenes/S15_SellFlow";
import { S16_OneHome } from "./scenes/S16_OneHome";
import { S17_Shield } from "./scenes/S17_Shield";
import { S18_Rewards } from "./scenes/S18_Rewards";
import { S19_RewardsUi } from "./scenes/S19_RewardsUi";
import { S20_Discover } from "./scenes/S20_Discover";
import { S21_NowLive } from "./scenes/S21_NowLive";
import { S22_LogoResolve } from "./scenes/S22_LogoResolve";
import { colors } from "./theme";
import type { ShotId } from "./timeline";
import { absoluteCues, DURATION, FPS, SHOTS } from "./timeline";

export const wpnSchema = z.object({
  music: z.enum(["scratch", "licensed", "none"]),
  sfx: z.boolean(),
});

export type WpnProps = z.infer<typeof wpnSchema>;

export const wpnDefaultProps: WpnProps = { music: "scratch", sfx: true };

export const SCENES: Record<ShotId, React.FC> = {
  S01: S01_Welcome,
  S02: S02_YourArt,
  S03: S03_Visible,
  S04: S04_Forever,
  S05: S05_GoPrivate,
  S06: S06_Marketplace,
  S07: S07_PoweredBy,
  S08: S08_Introducing,
  S09: S09_LogoRing,
  S10: S10_SingleClick,
  S11: S11_Buy,
  S12: S12_BuyFlow,
  S13: S13_KeepPrivate,
  S14: S14_Sell,
  S15: S15_SellFlow,
  S16: S16_OneHome,
  S17: S17_Shield,
  S18: S18_Rewards,
  S19: S19_RewardsUi,
  S20: S20_Discover,
  S21: S21_NowLive,
  S22: S22_LogoResolve,
};

// Whoosh on whip moves and gradient wipes
const WHOOSH_AT = [
  absoluteCues.S01.whip - 2,
  absoluteCues.S02.whip,
  absoluteCues.S05.push - 2,
  absoluteCues.S11.wipe,
  absoluteCues.S13.spaced - 5,
  absoluteCues.S14.wipe,
  SHOTS.S18.to - 10,
];

const musicSrc = (music: WpnProps["music"]) =>
  music === "scratch"
    ? MUSIC.scratch
    : music === "licensed"
      ? MUSIC.licensed
      : null;

export const WhyPrivateNFTs: React.FC<WpnProps> = ({ music, sfx }) => {
  const files = getStaticFiles();
  const src = musicSrc(music);
  const hasMusic = src !== null && files.some((f) => f.name === src);
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      {(Object.keys(SHOTS) as ShotId[]).map((id) => {
        const Scene = SCENES[id];
        return (
          <Sequence
            key={id}
            name={id}
            from={SHOTS[id].from}
            durationInFrames={SHOTS[id].to - SHOTS[id].from}
          >
            <Scene />
          </Sequence>
        );
      })}
      <Vignette />
      <FilmGrain />
      {hasMusic && (
        <Audio
          src={staticFile(src)}
          volume={(f) =>
            music === "licensed"
              ? interpolate(f, [DURATION - 2 * FPS, DURATION], [1, 0], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                })
              : 1
          }
        />
      )}
      {sfx &&
        WHOOSH_AT.map((at) => (
          <Sequence key={at} from={at} durationInFrames={30}>
            <Audio src={staticFile(SFX.whoosh)} volume={0.25} />
          </Sequence>
        ))}
    </AbsoluteFill>
  );
};

// Single scene with grain + vignette, for Studio previews
export const ScenePreview: React.FC<{ id: ShotId }> = ({ id }) => {
  const Scene = SCENES[id];
  return (
    <AbsoluteFill style={{ background: colors.bg }}>
      <Scene />
      <Vignette />
      <FilmGrain />
    </AbsoluteFill>
  );
};
