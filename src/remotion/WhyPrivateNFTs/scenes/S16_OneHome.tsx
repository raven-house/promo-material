import type React from "react";
import { AbsoluteFill } from "remotion";
import { CardMosaic } from "../components/Cards";
import { FlickerReveal } from "../components/FlickerReveal";
import { useFit } from "../components/util";
import { copy } from "../copy";
import { cues, shotLength } from "../timeline";
import { Word } from "./common";

const c = cues.S16;
const L = shotLength("S16");

// Parallax NFT card mosaic: ONE HOME → FOR → PRIVATE COLLECTORS
export const S16_OneHome: React.FC = () => {
  const fs = useFit(copy.S16.collectors, 104, 800, "0.02em", 0.86);
  const shadow = {
    textShadow: "0 6px 30px rgba(14,10,34,0.9), 0 0 4px rgba(14,10,34,0.8)",
  };
  const words = [
    { from: c.home, to: c.for, text: copy.S16.home },
    { from: c.for, to: c.collectors, text: copy.S16.for },
    { from: c.collectors, to: L, text: copy.S16.collectors },
  ];
  return (
    <AbsoluteFill>
      <CardMosaic seed="s16" />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(14,10,34,0.55) 0%, rgba(14,10,34,0) 60%)",
        }}
      />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        {words.map((w, i) => (
          <Word key={w.text} from={w.from} to={w.to}>
            <FlickerReveal
              text={w.text}
              start={0}
              window={9}
              outStart={i < 2 ? w.to - w.from - 7 : undefined}
              outWindow={5}
              style={{ fontSize: fs, ...shadow }}
            />
          </Word>
        ))}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
