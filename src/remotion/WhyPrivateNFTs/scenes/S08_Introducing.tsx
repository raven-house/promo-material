import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { LogoRing } from "../components/Brand";
import { GlitchText } from "../components/GlitchText";
import { CornerSquares, GridCells } from "../components/GridWord";
import { ip, useLayout } from "../components/util";
import { copy } from "../copy";
import { gridWord } from "../theme";
import { cues, shotLength } from "../timeline";
import { Word } from "./common";

const c = cues.S08;
const L = shotLength("S08");

// Glitch → INTRODUCING (corner brackets) → THE (grid) → a dot grows into the logo ring
export const S08_Introducing: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait, width } = useLayout();
  const fs = portrait ? 92 : 118;
  const style: React.CSSProperties = {
    ...gridWord,
    fontWeight: 800,
    fontSize: fs,
    letterSpacing: "0.02em",
  };
  const boxW = Math.min(width * 0.9, 1000);
  return (
    <Backdrop>
      <Word from={0} to={c.introducing}>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <GlitchText
            text="KJUSPF DQ"
            dur={c.introducing}
            inFrames={0}
            outFrames={c.introducing}
            intensity={0.8}
            style={{ ...style, opacity: 0.5 }}
          />
        </AbsoluteFill>
      </Word>
      <Word from={c.introducing} to={c.ring}>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <GridCells
            seed={f < c.the ? "s08-a" : "s08-b"}
            cols={portrait ? 9 : 12}
            cell={74}
            rows={2}
            opacity={0.55}
            appear={ip(f, [c.introducing, c.introducing + 10], [0.3, 1])}
          />
        </AbsoluteFill>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <CornerSquares w={boxW} h={180} />
        </AbsoluteFill>
      </Word>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Word from={c.introducing} to={c.the}>
          <GlitchText
            text={copy.S08.introducing}
            dur={c.the - c.introducing}
            inFrames={7}
            outFrames={6}
            style={style}
          />
        </Word>
        <Word from={c.the} to={c.ring}>
          <GlitchText
            text={copy.S08.the}
            dur={c.ring - c.the}
            inFrames={5}
            outFrames={6}
            style={style}
          />
        </Word>
      </AbsoluteFill>
      <Word from={c.ring} to={L}>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <LogoRing size={380} dotAt={0} discAt={999} />
        </AbsoluteFill>
      </Word>
    </Backdrop>
  );
};
