import { ArrowLeftRight, Eye, Image as ImageIcon, Wallet } from "lucide-react";
import type React from "react";
import {
  AbsoluteFill,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { HeroCube, NeonCubeField } from "../components/Cubes";
import { FlickerReveal } from "../components/FlickerReveal";
import { ip, useFit, useLayout } from "../components/util";
import { copy } from "../copy";
import { colors, springs } from "../theme";
import { cues, shotLength } from "../timeline";
import { WhipBlur, Word } from "./common";

const c = cues.S02;
const L = shotLength("S02");

const WORDS = [
  {
    at: c.art,
    to: c.trades,
    text: copy.S02.art,
    Icon: ImageIcon,
    color: colors.purple,
  },
  {
    at: c.trades,
    to: c.wallet,
    text: copy.S02.trades,
    Icon: ArrowLeftRight,
    color: "#5E7BFF",
  },
  {
    at: c.wallet,
    to: c.solid,
    text: copy.S02.wallet,
    Icon: Wallet,
    color: colors.magenta,
  },
];

// Neon cube field; hero cube shows what the public ledger exposes, then a glass "eye" cube whips into camera
export const S02_YourArt: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { height, portrait } = useLayout();
  const fs = useFit(copy.S02.trades, 112, 800, "0.03em");
  const enter = spring({
    frame: f,
    fps,
    config: springs.smooth,
    durationInFrames: 25,
  });
  const current = [...WORDS].reverse().find((w) => f >= w.at) ?? WORDS[0];
  // extra spin kick at each word change
  const kicks = WORDS.map((w) =>
    spring({ frame: f - w.at, fps, config: springs.snappy }),
  ).reduce((a, b) => a + b, 0);
  const solid = f >= c.solid;
  const solidPop = spring({ frame: f - c.solid, fps, config: springs.pop });
  const whip = ip(f, [c.whip, L - 2], [0, 1], Easing.in(Easing.quad));
  const ringAngle = f * 6;
  const ringOn = WORDS.some((w) => f >= w.at && f < w.at + 14) || solid;
  const iconPop = spring({ frame: f - current.at, fps, config: springs.pop });
  const cubeScale =
    (0.45 + 0.55 * enter) * (solid ? 0.7 + 0.3 * solidPop : 1) * (1 + whip * 7);
  return (
    <Backdrop>
      <WhipBlur active={whip > 0}>
        <AbsoluteFill style={{ transform: `scale(${1 + whip * 0.6})` }}>
          <NeonCubeField count={portrait ? 18 : 24} seed="s02" />
        </AbsoluteFill>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              transform: `translateY(${portrait ? -height * 0.04 : -height * 0.025}px) scale(${cubeScale})`,
            }}
          >
            {!solid ? (
              <HeroCube
                size={340}
                rx={-16 + Math.sin(f * 0.05) * 8}
                ry={25 + f * 1.2 + kicks * 90}
                rz={Math.sin(f * 0.03) * 6}
                color={current.color}
                Icon={f >= c.art ? current.Icon : undefined}
                iconPop={f >= c.art ? iconPop : 0}
                ring={
                  ringOn
                    ? {
                        angle: ringAngle,
                        color: colors.cyan,
                        color2: colors.magenta,
                        opacity: 0.9,
                      }
                    : null
                }
              />
            ) : (
              <HeroCube
                size={300}
                variant="solid"
                rx={-20 + f * 0.6}
                ry={f * 4}
                rz={10}
                Icon={Eye}
                iconColor="#FFD1E6"
                ring={{
                  angle: ringAngle * 1.4,
                  color: colors.magenta,
                  color2: colors.purple,
                  tilt: 64,
                }}
              />
            )}
          </div>
        </AbsoluteFill>
        <AbsoluteFill style={{ opacity: 1 - whip }}>
          {WORDS.map((w) => (
            <Word key={w.text} from={w.at} to={w.to}>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: height * 0.78,
                  textAlign: "center",
                }}
              >
                <FlickerReveal
                  text={w.text}
                  start={0}
                  window={8}
                  outStart={w.to - w.at - 7}
                  outWindow={5}
                  style={{ fontSize: fs, letterSpacing: "0.03em" }}
                />
              </div>
            </Word>
          ))}
        </AbsoluteFill>
      </WhipBlur>
      <AbsoluteFill
        style={{ background: colors.bg, opacity: ip(f, [L - 4, L], [0, 1]) }}
      />
    </Backdrop>
  );
};
