import { ShoppingBag } from "lucide-react";
import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { FlickerReveal } from "../components/FlickerReveal";
import { GradientCard, GradientWipe } from "../components/Shapes";
import { ip, useLayout } from "../components/util";
import { copy } from "../copy";
import { cues } from "../timeline";

const c = cues.S11;

export const CardLabel: React.FC<{
  text: string;
  start: number;
  spacing?: string;
}> = ({ text, start, spacing = "0.04em" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <div
      style={{
        width: 70,
        height: 58,
        borderRadius: 6,
        background: "linear-gradient(90deg, rgba(123,92,240,0), #3B2A8E)",
      }}
    />
    <FlickerReveal
      text={text}
      start={start}
      window={8}
      style={{ fontSize: 66, letterSpacing: spacing }}
    />
    <div style={{ width: 88 }} />
  </div>
);

// Gradient wipe collapses into the BUY card; satellites pop, cursor clicks the bag
export const S11_Buy: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait, width, height } = useLayout();
  const w = portrait ? 700 * 0.82 : 700;
  const h = portrait ? 430 * 0.82 : 430;
  const drift = ip(f, [c.card, 66], [1, 1.06]);
  return (
    <Backdrop>
      <AbsoluteFill style={{ transform: `scale(${drift})` }}>
        {f >= c.card - 4 && (
          <GradientCard
            Icon={ShoppingBag}
            popAt={c.card - 4}
            clickAt={c.click}
            iconDraw={ip(f, [c.card - 3, c.card + 3], [0, 1])}
            label={<CardLabel text={copy.S11.label} start={c.label} />}
          />
        )}
      </AbsoluteFill>
      <GradientWipe
        grow={[0, 7]}
        shrink={[8, c.card]}
        target={{ w: w * drift, h: h * drift, x: width / 2, y: height / 2 }}
      />
    </Backdrop>
  );
};
