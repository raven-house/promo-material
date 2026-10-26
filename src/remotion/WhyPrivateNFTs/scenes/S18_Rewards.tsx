import type React from "react";
import {
  AbsoluteFill,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { Box3D, NeonCubeField } from "../components/Cubes";
import { FlickerReveal } from "../components/FlickerReveal";
import { ip, range, rr, useFit, useLayout } from "../components/util";
import { copy } from "../copy";
import { colors, headline, outlineText, springs } from "../theme";
import { cues, shotLength } from "../timeline";
import { WhipBlur, Word } from "./common";

const c = cues.S18;
const L = shotLength("S18");

const GiftCube: React.FC<{ size: number; rx: number; ry: number }> = ({
  size,
  rx,
  ry,
}) => (
  <div style={{ perspective: 900, position: "relative" }}>
    {/* bow */}
    <svg
      width={size * 0.7}
      height={size * 0.42}
      viewBox="0 0 70 42"
      style={{
        position: "absolute",
        left: size * 0.15,
        top: -size * 0.52,
        overflow: "visible",
      }}
    >
      <ellipse
        cx={22}
        cy={22}
        rx={16}
        ry={11}
        fill="none"
        stroke="#C9B8FF"
        strokeWidth={4}
        transform="rotate(-25 22 22)"
      />
      <ellipse
        cx={48}
        cy={22}
        rx={16}
        ry={11}
        fill="none"
        stroke="#C9B8FF"
        strokeWidth={4}
        transform="rotate(25 48 22)"
      />
    </svg>
    <Box3D
      size={size}
      rx={rx}
      ry={ry}
      face={(i) => ({
        background:
          i === 4
            ? "linear-gradient(135deg, #D9CCFF, #9F86FF)"
            : i % 2 === 0
              ? "linear-gradient(160deg, #B9A3FF 0%, #7B5CF0 60%, #2EE6F0 140%)"
              : "linear-gradient(160deg, #8F78FF 0%, #4B2FB0 100%)",
        border: "2px solid rgba(255,255,255,0.7)",
        borderRadius: 8,
        boxShadow: "inset 0 0 30px rgba(255,255,255,0.25)",
      })}
    >
      {() => (
        <>
          <div
            style={{
              position: "absolute",
              left: "46%",
              top: 0,
              bottom: 0,
              width: "8%",
              background: "rgba(14,10,34,0.75)",
              boxShadow: `0 0 10px ${colors.cyan}`,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "46%",
              left: 0,
              right: 0,
              height: "8%",
              background: "rgba(14,10,34,0.75)",
              boxShadow: `0 0 10px ${colors.cyan}`,
            }}
          />
        </>
      )}
    </Box3D>
  </div>
);

// Ghost copies to the left and right of a word (UNLOCK / REWARDS) or above/below (MEMBERSHIPS)
const Ghosts: React.FC<{
  text: string;
  fs: number;
  axis: "x" | "y";
  opacity: number;
}> = ({ text, fs, axis, opacity }) => (
  <>
    {[-1, 1].map((s) => (
      <div
        key={s}
        style={{
          ...headline,
          ...outlineText,
          fontSize: fs,
          letterSpacing: "0.12em",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) ${axis === "x" ? `translateX(${s * fs * text.length * 0.95}px)` : `translateY(${s * fs * 1.15}px)`}`,
          opacity,
        }}
      >
        {text}
      </div>
    ))}
  </>
);

// Blurred neon cubes: UNLOCK → MEMBERSHIPS → AND → gift cube pops with confetti lines: REWARDS
export const S18_Rewards: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { height } = useLayout();
  const fs = useFit(copy.S18.memberships, 88, 800, "0.12em", 0.82);
  const gift = spring({ frame: f - c.rewards, fps, config: springs.pop });
  const giftBehindAnd = spring({
    frame: f - c.and,
    fps,
    config: springs.smooth,
  });
  const whip = ip(f, [L - 9, L], [0, 1], Easing.in(Easing.cubic));
  const words = [
    { from: 0, to: c.memberships, text: copy.S18.unlock, axis: "x" as const },
    {
      from: c.memberships,
      to: c.and,
      text: copy.S18.memberships,
      axis: "y" as const,
    },
    { from: c.and, to: c.rewards, text: copy.S18.and, axis: "x" as const },
  ];
  return (
    <Backdrop>
      <NeonCubeField
        count={20}
        seed="s18"
        focus={1.9}
        blurBoost={1}
        speed={0.6}
      />
      <WhipBlur active={whip > 0} samples={6}>
        {f >= c.and && (
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <div
              style={{
                transform: `translateY(${f < c.rewards ? 0 : ip(gift, [0, 1], [0, -height * 0.04])}px) scale(${(f < c.rewards ? 0.55 * giftBehindAnd : 0.8 + 0.2 * gift) * (1 + whip * 4)})`,
                opacity: f < c.rewards ? 0.85 : 1,
              }}
            >
              <GiftCube
                size={250}
                rx={-22 + Math.sin(f * 0.1) * 6}
                ry={35 + f * 2.2}
              />
            </div>
          </AbsoluteFill>
        )}
        {f >= c.rewards &&
          range(10).map((i) => {
            const a = rr(`conf-a-${i}`, 0, Math.PI * 2);
            const p = ip(
              f - c.rewards,
              [0, 14],
              [0, 1],
              Easing.out(Easing.cubic),
            );
            const r0 = 140 + 160 * p;
            const len = 50 * (1 - p) + 10;
            const col = i % 3 === 0 ? colors.magenta : colors.cyan;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `calc(50% + ${Math.cos(a) * r0}px)`,
                  top: `calc(50% - ${height * 0.04}px + ${Math.sin(a) * r0}px)`,
                  width: i % 4 === 0 ? 12 : len,
                  height: i % 4 === 0 ? 12 : 4,
                  borderRadius: 6,
                  background: col,
                  boxShadow: `0 0 8px ${col}`,
                  transform: `rotate(${a}rad)`,
                  opacity: 1 - ip(f - c.rewards, [10, 24], [0, 1]),
                }}
              />
            );
          })}
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          {words.map((w) => (
            <Word key={w.text} from={w.from} to={w.to}>
              <AbsoluteFill
                style={{ justifyContent: "center", alignItems: "center" }}
              >
                <Ghosts text={w.text} fs={fs} axis={w.axis} opacity={0.5} />
                <FlickerReveal
                  text={w.text}
                  start={0}
                  window={7}
                  outStart={w.to - w.from - 5}
                  outWindow={4}
                  style={{ fontSize: fs, letterSpacing: "0.12em" }}
                />
              </AbsoluteFill>
            </Word>
          ))}
        </AbsoluteFill>
        <Word from={c.rewards} to={L}>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: height * 0.76,
              height: fs * 1.2,
            }}
          >
            <Ghosts
              text={copy.S18.rewards}
              fs={fs}
              axis="x"
              opacity={ip(f - c.rewards, [0, 8, 16], [0, 0.5, 0])}
            />
            <div style={{ textAlign: "center" }}>
              <FlickerReveal
                text={copy.S18.rewards}
                start={0}
                window={8}
                style={{ fontSize: fs, letterSpacing: "0.14em" }}
              />
            </div>
          </div>
        </Word>
      </WhipBlur>
    </Backdrop>
  );
};
