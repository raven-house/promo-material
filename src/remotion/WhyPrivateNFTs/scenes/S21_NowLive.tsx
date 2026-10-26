import type React from "react";
import { AbsoluteFill } from "remotion";
import { CardTunnel } from "../components/Cards";
import { FlickerReveal } from "../components/FlickerReveal";
import { useFit, useLayout } from "../components/util";
import { copy } from "../copy";
import { cues, shotLength } from "../timeline";
import { Word } from "./common";

const c = cues.S21;
const L = shotLength("S21");

// Card tunnel: NOW LIVE ON → AZTEC ALPHA MAINNET → flicker out
export const S21_NowLive: React.FC = () => {
  const { portrait } = useLayout();
  const fs = useFit(copy.S21.network, 96, 800, "0.02em", 0.86);
  return (
    <AbsoluteFill>
      <CardTunnel band={portrait ? 260 : 230} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <Word from={c.live} to={c.network}>
          <FlickerReveal
            text={copy.S21.live}
            start={0}
            window={10}
            outStart={c.network - c.live - 7}
            outWindow={5}
            style={{ fontSize: fs }}
          />
        </Word>
        <Word from={c.network} to={L}>
          <FlickerReveal
            text={copy.S21.network}
            start={0}
            window={10}
            outStart={c.out - c.network}
            outWindow={7}
            style={{ fontSize: fs }}
          />
        </Word>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
