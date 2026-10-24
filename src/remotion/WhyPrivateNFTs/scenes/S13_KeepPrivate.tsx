import type React from "react";
import {
  AbsoluteFill,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { EchoStack } from "../components/EchoStack";
import { FlickerReveal } from "../components/FlickerReveal";
import { BubbleField, Orb, OrbitRings } from "../components/Shapes";
import { ip, useFit, useLayout } from "../components/util";
import { copy } from "../copy";
import { headline, springs } from "../theme";
import { cues, shotLength } from "../timeline";
import { WhipBlur, Word } from "./common";

const c = cues.S13;
const L = shotLength("S13");

const THIN_ARCS = [
  {
    r: 0.4,
    thick: 3,
    len: 120,
    start: 200,
    speed: 1.4,
    thin: true,
    colorSet: 0,
  },
  {
    r: 0.33,
    thick: 3,
    len: 90,
    start: 20,
    speed: -1.1,
    thin: true,
    colorSet: 2,
  },
  {
    r: 0.62,
    thick: 4,
    len: 70,
    start: 120,
    speed: 0.8,
    thin: true,
    colorSet: 3,
  },
];

// AND (orb) → KEEP YOUR (orbs) → COLLECTION (orbit arcs) → P R I V A T E collapses to PRIVATE in a raven bubble field
export const S13_KeepPrivate: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { portrait } = useLayout();
  const fsSmall = portrait ? 96 : 120;
  const fsColl = useFit(copy.S13.collection, 122, 800, "0.04em", 0.8);
  const fsPriv = useFit("P R I V A T E", 110, 800, "0.5em", 0.8);
  const orbPop = spring({ frame: f, fps, config: springs.pop });
  const orb2 = spring({ frame: f - c.keep, fps, config: springs.pop });
  const whip =
    ip(f, [c.spaced - 4, c.spaced + 2], [0, 1]) *
    ip(f, [c.spaced + 2, c.spaced + 3], [1, 0]);
  const spacing = ip(
    f,
    [c.collapse, c.collapse + 7],
    [0.62, 0.02],
    Easing.out(Easing.cubic),
  );
  const bubblesIn = ip(
    f,
    [c.spaced, c.spaced + 22],
    [0, 1],
    Easing.out(Easing.cubic),
  );
  return (
    <Backdrop>
      <Word from={0} to={c.collection}>
        <OrbitRings arcs={THIN_ARCS} />
        <AbsoluteFill>
          <Orb
            size={500 * (f < c.keep ? orbPop : 1)}
            x={f < c.keep ? 0 : ip(f, [c.keep, c.keep + 8], [0, 290])}
            blur={10}
          />
          {f >= c.keep && (
            <Orb size={360 * orb2} x={-330} blur={14} opacity={0.75} />
          )}
        </AbsoluteFill>
      </Word>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Word from={0} to={c.keep}>
          <FlickerReveal
            text={copy.S13.and}
            start={2}
            window={6}
            outStart={c.keep - 6}
            outWindow={4}
            style={{ fontSize: fsSmall, letterSpacing: "0.1em" }}
          />
        </Word>
        <Word from={c.keep} to={c.collection}>
          <FlickerReveal
            text={copy.S13.keep}
            start={0}
            window={7}
            outStart={c.collection - c.keep - 6}
            outWindow={4}
            highlight="YOUR"
            style={{ fontSize: fsSmall }}
          />
        </Word>
      </AbsoluteFill>
      <Word from={c.collection} to={c.spaced}>
        <WhipBlur active={whip > 0} samples={6}>
          <OrbitRings
            scale={ip(
              f - c.collection,
              [0, 10],
              [0.85, 1],
              Easing.out(Easing.cubic),
            )}
          />
          <AbsoluteFill
            style={{
              justifyContent: "center",
              alignItems: "center",
              transform: `translateX(${whip * -260}px)`,
            }}
          >
            <EchoStack
              word={copy.S13.collection}
              fontSize={fsColl}
              start={0}
              spread={14}
              letterSpacing={`${ip(f - c.collection, [0, 8], [0.4, 0.04])}em`}
            />
          </AbsoluteFill>
        </WhipBlur>
      </Word>
      <Word from={c.spaced} to={L}>
        <BubbleField
          seed="s13"
          appear={bubblesIn}
          ringR={ip(
            f,
            [c.spaced, c.collapse],
            [portrait ? 480 : 560, portrait ? 300 : 330],
            Easing.inOut(Easing.cubic),
          )}
        />
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          {f < c.collapse ? (
            <FlickerReveal
              text={copy.S13.private}
              start={0}
              window={8}
              style={{
                ...headline,
                fontSize: fsPriv,
                letterSpacing: "0.62em",
                marginRight: "-0.62em",
              }}
            />
          ) : (
            <EchoStack
              word={copy.S13.private}
              fontSize={fsPriv}
              start={c.collapse - c.spaced}
              spread={10}
              flicker={false}
              letterSpacing={`${spacing}em`}
            />
          )}
        </AbsoluteFill>
      </Word>
    </Backdrop>
  );
};
