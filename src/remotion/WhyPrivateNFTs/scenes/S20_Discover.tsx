import type React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { glitchAmount, GlitchText } from "../components/GlitchText";
import { GridWord } from "../components/GridWord";
import { ip, useLayout } from "../components/util";
import { copy } from "../copy";
import { colors, gridWord } from "../theme";
import { cues, shotLength } from "../timeline";
import { Word } from "./common";

const c = cues.S20;
const L = shotLength("S20");

// Swoosh line, then grid-word beats: DISCOVER → MINT → TRADE → OWN
export const S20_Discover: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait, width, height } = useLayout();
  const starts = [c.discover, c.mint, c.trade, c.own, L];
  const idx = Math.max(
    0,
    starts.findIndex((s, i) => f >= s && f < starts[i + 1]),
  );
  const local = f - starts[idx];
  const dur = starts[idx + 1] - starts[idx];
  const g = glitchAmount(local, dur, 7, idx === 3 ? 0 : 4);
  const swoosh = ip(f, [0, 8], [0, 1], Easing.out(Easing.cubic));
  const fs = portrait ? 76 : 88;
  const fadeEnd = ip(f, [L - 6, L], [1, 0]);
  return (
    <Backdrop>
      <AbsoluteFill style={{ opacity: fadeEnd }}>
        <GridWord
          seed={`s20-${idx}`}
          corners={{ w: portrait ? width * 0.86 : 1200, h: 215 }}
          glitch={g}
          gridOpacity={0.85}
          cols={portrait ? 11 : 14}
          cell={80}
        >
          {copy.S20.words.map((w, i) => (
            <Word key={w} from={starts[i]} to={starts[i + 1]}>
              <GlitchText
                text={w}
                dur={starts[i + 1] - starts[i]}
                inFrames={7}
                outFrames={i === 3 ? 0 : 4}
                style={{ ...gridWord, fontSize: fs }}
              />
            </Word>
          ))}
        </GridWord>
      </AbsoluteFill>
      {swoosh < 1 && (
        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0 }}
        >
          <path
            d={`M ${-100} ${height * 0.62} Q ${width * 0.5} ${height * 0.3} ${width + 100} ${height * 0.45}`}
            stroke={colors.cyan}
            strokeWidth={6}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${width * 0.35} ${width * 3}`}
            strokeDashoffset={-swoosh * width * 1.4 + width * 0.3}
            style={{ filter: `drop-shadow(0 0 10px ${colors.cyan})` }}
          />
        </svg>
      )}
    </Backdrop>
  );
};
