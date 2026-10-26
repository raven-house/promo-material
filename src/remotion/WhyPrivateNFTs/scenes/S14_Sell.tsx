import { Tag } from "lucide-react";
import type React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { EchoStack } from "../components/EchoStack";
import { FlickerReveal } from "../components/FlickerReveal";
import { GradientCard, GradientWipe, OrbitRings } from "../components/Shapes";
import { ip, useFit, useLayout } from "../components/util";
import { copy } from "../copy";
import { headline } from "../theme";
import { cues, shotLength } from "../timeline";
import { CardLabel } from "./S11_Buy";
import { Word } from "./common";

const c = cues.S14;
const L = shotLength("S14");

const ARCS_A = [
  {
    r: 0.52,
    thick: 24,
    len: 70,
    start: 300,
    speed: 1.2,
    dots: true,
    colorSet: 1,
  },
  {
    r: 0.52,
    thick: 24,
    len: 60,
    start: 110,
    speed: 1.2,
    dots: true,
    colorSet: 1,
  },
  {
    r: 0.6,
    thick: 3,
    len: 120,
    start: 180,
    speed: -0.6,
    thin: true,
    colorSet: 2,
  },
];

// Wipe → SELL card (tag icon) → WITH → ESCROW → BACKED → TRADES inside orbit arcs
export const S14_Sell: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait, width, height } = useLayout();
  const w = portrait ? 700 * 0.82 : 700;
  const h = portrait ? 430 * 0.82 : 430;
  const fs = useFit(copy.S14.escrow, 100, 800, "0.04em", 0.6);
  const cardOut = ip(
    f,
    [c.with - 22, c.with - 4],
    [0, 1],
    Easing.in(Easing.cubic),
  );
  const sellSpacing = ip(f, [c.with - 30, c.with - 4], [0.04, 0.16]);
  const ringsGrow = ip(f, [c.with, L], [0.86, 1.12]);
  const words = [
    { from: c.with, to: c.escrow, text: copy.S14.with, ghost: true },
    { from: c.escrow, to: c.backed, text: copy.S14.escrow, ghost: false },
    { from: c.backed, to: c.trades, text: copy.S14.backed, ghost: false },
  ];
  return (
    <Backdrop>
      <Word from={0} to={c.with}>
        <AbsoluteFill style={{ opacity: 1 - cardOut * 0.6 }}>
          {f >= 6 && (
            <GradientCard
              Icon={Tag}
              popAt={6}
              satellites={cardOut < 0.95}
              scale={1 - cardOut * 0.3}
              iconDraw={ip(f, [6, 11], [0, 1])}
              label={
                <CardLabel
                  text={copy.S14.sell}
                  start={c.sell}
                  spacing={`${sellSpacing}em`}
                />
              }
            />
          )}
        </AbsoluteFill>
        <GradientWipe
          grow={[0, 6]}
          shrink={[6, 10]}
          target={{ w, h, x: width / 2, y: height / 2 }}
        />
      </Word>
      <Word from={c.with} to={L}>
        <OrbitRings
          scale={ringsGrow}
          arcs={f < c.backed ? ARCS_A : undefined}
          spin={1.3}
        />
      </Word>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {words.map((wd) => (
          <Word key={wd.text} from={wd.from} to={wd.to}>
            <FlickerReveal
              text={wd.text}
              start={0}
              window={5}
              outStart={wd.to - wd.from - 3}
              outWindow={3}
              ghost={wd.ghost}
              style={{ ...headline, fontSize: fs }}
            />
          </Word>
        ))}
        <Word from={c.trades} to={L}>
          <EchoStack
            word={copy.S14.trades}
            fontSize={fs}
            start={0}
            spread={12}
            outStart={L - c.trades - 6}
          />
        </Word>
      </AbsoluteFill>
    </Backdrop>
  );
};
