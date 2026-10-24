import type React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { LogoRing } from "../components/Brand";
import { GlitchText } from "../components/GlitchText";
import { ip, useFit, useLayout } from "../components/util";
import { copy } from "../copy";
import { headline } from "../theme";
import { cues, shotLength } from "../timeline";
import { Word } from "./common";

const c = cues.S09;
const L = shotLength("S09");

// Raven mark badge in rotating rings; RAVEN HOUSE MARKETPLACE label glitches in and out
export const S09_LogoRing: React.FC = () => {
  const f = useCurrentFrame();
  const { height } = useLayout();
  const fs = useFit(copy.S09.label, 60, 800, "0.02em", 0.86);
  const zoom = 1 + ip(f, [c.out - 16, L], [0, 0.85], Easing.in(Easing.cubic));
  return (
    <Backdrop>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${zoom})`,
        }}
      >
        <LogoRing size={380} dotAt={-20} discAt={1} />
      </AbsoluteFill>
      <Word from={c.label} to={c.out}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: height * 0.835,
            textAlign: "center",
          }}
        >
          <GlitchText
            text={copy.S09.label}
            dur={c.out - c.label}
            inFrames={9}
            outFrames={7}
            style={{ ...headline, fontSize: fs }}
          />
        </div>
      </Word>
    </Backdrop>
  );
};
