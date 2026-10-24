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
import { BauhausBackdrop } from "../components/Shapes";
import { ip, useFit, useLayout } from "../components/util";
import { copy } from "../copy";
import { GRADIENT, springs } from "../theme";
import { cues, shotLength } from "../timeline";
import { WhipBlur } from "./common";

const c = cues.S05;
const L = shotLength("S05");

// Bauhaus mosaic; GO PRIVATE flickers inside a gradient card that then pushes into camera
export const S05_GoPrivate: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { width, portrait } = useLayout();
  const cardW = portrait ? width * 0.86 : 880;
  const cardH = portrait ? 420 : 430;
  const fs = useFit(copy.S05.word, 112, 800, "0.02em", (cardW * 0.86) / width);
  const pop = spring({ frame: f, fps, config: springs.snappy });
  const push = ip(f, [c.push, L], [0, 1], Easing.in(Easing.cubic));
  return (
    <Backdrop>
      <WhipBlur active={push > 0} samples={6}>
        <AbsoluteFill style={{ transform: `scale(${1 + push * 0.8})` }}>
          <BauhausBackdrop seed="s05" />
        </AbsoluteFill>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <div
            style={{
              width: cardW,
              height: cardH,
              background: GRADIENT,
              borderRadius: 4,
              transform: `scale(${(0.7 + 0.3 * pop) * (1 + push * 4.5)})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 30px 90px rgba(10,5,40,0.6)",
            }}
          >
            {f >= c.word - 10 && (
              <EchoStack
                word={copy.S05.word}
                fontSize={fs}
                start={c.word - 10}
                spread={10}
                gap={[0.98, 1.02]}
                mode="hold"
                echoColor="rgba(255,255,255,0.45)"
              />
            )}
          </div>
        </AbsoluteFill>
      </WhipBlur>
    </Backdrop>
  );
};
