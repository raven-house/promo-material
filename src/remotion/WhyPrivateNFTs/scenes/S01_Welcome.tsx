import type React from "react";
import {
  AbsoluteFill,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Backdrop } from "../components/Backdrop";
import { glitchAmount, GlitchText } from "../components/GlitchText";
import { GridCells, HatchStrips } from "../components/GridWord";
import { LoadingBar } from "../components/LoadingBar";
import { ip, useFit, useLayout } from "../components/util";
import { copy } from "../copy";
import { gridWord, springs } from "../theme";
import { cues, shotLength } from "../timeline";
import { WhipBlur, Word } from "./common";

const c = cues.S01;
const L = shotLength("S01");

// WELCOME → TO THE → PUBLIC LEDGER over a cell grid + loading bar, whip-zoom out
export const S01_Welcome: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { height, portrait } = useLayout();
  const fsWelcome = useFit(copy.S01.welcome, 118, 800, "0.05em");
  const fsLedger = useFit(copy.S01.ledger, 112, 800, "0.14em");
  const word: React.CSSProperties = {
    ...gridWord,
    fontWeight: 800,
    letterSpacing: "0.05em",
    fontSize: fsWelcome,
  };
  const barPop = spring({ frame: f - c.welcome - 4, fps, config: springs.pop });
  const progress = ip(f, [c.welcome + 4, c.whip], [0.05, 0.78]);
  const whip = ip(f, [c.whip, L], [0, 1], Easing.in(Easing.cubic));
  const g =
    Math.max(
      glitchAmount(f - c.welcome, c.toThe - c.welcome, 10, 7),
      glitchAmount(f - c.toThe, c.ledger - c.toThe, 6, 4),
    ) * (f >= c.welcome && f < c.ledger ? 1 : 0);
  return (
    <Backdrop>
      <WhipBlur active={whip > 0}>
        <AbsoluteFill
          style={{
            transform: `scale(${1 + whip * 1.6})`,
            opacity: 1 - ip(whip, [0.7, 1], [0, 1]),
          }}
        >
          <HatchStrips glitch={g} />
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <GridCells
              seed={f < c.toThe ? "s01-a" : f < c.ledger ? "s01-b" : "s01-c"}
              cols={portrait ? 11 : 13}
              cell={portrait ? 90 : 116}
              appear={ip(f, [0, 12], [0.2, 1])}
            />
          </AbsoluteFill>
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Word from={c.welcome} to={c.toThe}>
              <GlitchText
                text={copy.S01.welcome}
                dur={c.toThe - c.welcome}
                inFrames={10}
                outFrames={7}
                intensity={0.6}
                style={word}
              />
            </Word>
            <Word from={c.toThe} to={c.ledger}>
              <GlitchText
                text={copy.S01.toThe}
                dur={c.ledger - c.toThe}
                inFrames={6}
                outFrames={4}
                intensity={0.6}
                style={word}
              />
            </Word>
            <Word from={c.ledger} to={L}>
              <GlitchText
                text={copy.S01.ledger}
                dur={L - c.ledger}
                inFrames={7}
                outFrames={0}
                intensity={0.6}
                style={{ ...word, fontSize: fsLedger, letterSpacing: "0.14em" }}
              />
            </Word>
          </AbsoluteFill>
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: height * 0.72,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <LoadingBar
              progress={progress}
              style={{ transform: `scale(${barPop})` }}
              opacity={f > c.welcome ? 1 : 0}
            />
          </div>
        </AbsoluteFill>
      </WhipBlur>
    </Backdrop>
  );
};
