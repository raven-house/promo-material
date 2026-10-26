import type React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { EchoStack } from "../components/EchoStack";
import { GlitchText } from "../components/GlitchText";
import { WordWall } from "../components/WordWall";
import { ip, useFit } from "../components/util";
import { copy } from "../copy";
import { headline } from "../theme";
import { cues, shotLength } from "../timeline";
import { Word } from "./common";

const c = cues.S10;
const L = shotLength("S10");

// A SINGLE CLICK AND (word wall) → IT'S YOURS (letters converge with RGB split, then echo stack)
export const S10_SingleClick: React.FC = () => {
  const f = useCurrentFrame();
  const fs = useFit(copy.S10.yours, 150, 800, "0.02em", 0.8);
  const local = f - c.yours;
  const spacing = ip(local, [0, 11], [1.1, 0.02], Easing.out(Easing.cubic));
  const settled = local >= 14;
  return (
    <Backdrop>
      <Word from={0} to={c.yours}>
        <WordWall
          phrase={copy.S10.wall}
          highlight={copy.S10.highlight}
          highlightAlt="A SINGLE"
          bright={3}
          dur={c.yours}
          fontSize={112}
          seed="s10"
        />
      </Word>
      <Word from={c.yours} to={L}>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          {!settled ? (
            <GlitchText
              text={copy.S10.yours}
              dur={14}
              inFrames={local < 8 ? 0 : 6}
              outFrames={0}
              intensity={local < 8 ? 0 : 1.4}
              style={{
                ...headline,
                fontSize: fs * ip(local, [0, 11], [0.55, 1]),
                letterSpacing: `${spacing}em`,
              }}
            />
          ) : (
            <div style={{ position: "relative" }}>
              <EchoStack
                word={copy.S10.yours}
                fontSize={fs}
                start={14}
                spread={10}
                flicker={false}
                echoColor="rgba(185,163,255,0.3)"
              />
              <Word from={L - c.yours - 6} to={L - c.yours}>
                <AbsoluteFill
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#0E0A22",
                  }}
                >
                  <GlitchText
                    text={copy.S10.yours}
                    dur={6}
                    inFrames={0}
                    outFrames={6}
                    intensity={1.5}
                    style={{ ...headline, fontSize: fs }}
                  />
                </AbsoluteFill>
              </Word>
            </div>
          )}
        </AbsoluteFill>
      </Word>
    </Backdrop>
  );
};
