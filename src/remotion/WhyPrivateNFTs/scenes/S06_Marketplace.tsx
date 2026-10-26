import type React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { SCREENS } from "../assets";
import { Backdrop } from "../components/Backdrop";
import { CardGrid3D } from "../components/Cards";
import { BubbleField } from "../components/Shapes";
import { ip, useLayout } from "../components/util";
import { cues, shotLength } from "../timeline";
import { WhipBlur } from "./common";

const c = cues.S06;
const L = shotLength("S06");

// Real Raven House collection page zooms from the bubble field into a dolly across a 3D card grid
export const S06_Marketplace: React.FC = () => {
  const f = useCurrentFrame();
  const { width, portrait } = useLayout();
  const zoom = ip(f, [0, c.grid], [0, 1], Easing.in(Easing.cubic));
  const shotW = portrait ? width * 0.8 : 760;
  const scale = 1 + zoom * ((width * 1.25) / shotW - 1);
  const gridIn = ip(f, [c.grid - 3, c.grid + 2], [0, 1]);
  const g = c.grid;
  return (
    <Backdrop>
      {f < c.grid + 3 && (
        <WhipBlur active={zoom > 0.4} samples={6}>
          <BubbleField
            seed="s06"
            ring={false}
            marks={false}
            clearCenter={0.2}
            scale={1 + zoom * 1.5}
          />
          <AbsoluteFill
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Img
              src={staticFile(SCREENS.collection)}
              style={{
                width: shotW,
                borderRadius: 6,
                transform: `scale(${scale})`,
                boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
              }}
            />
          </AbsoluteFill>
        </WhipBlur>
      )}
      {f >= c.grid - 3 && (
        <AbsoluteFill style={{ opacity: gridIn }}>
          <CardGrid3D
            seed={5}
            cols={12}
            rows={8}
            card={portrait ? 230 : 250}
            keys={[
              { f: g - 3, rx: 36, rz: -12, x: 900, y: 820, s: 2.3 },
              { f: g + 60, rx: 42, rz: -14, x: 260, y: 520, s: 2.5 },
              { f: g + 125, rx: 36, rz: -8, x: -700, y: 180, s: 2.3 },
              { f: L, rx: 30, rz: -6, x: -380, y: 80, s: 1.35 },
            ]}
            focus={[
              [g, 900, 900],
              [g + 60, 1500, 1150],
              [g + 125, 2250, 1400],
              [L, 1900, 1500],
            ]}
          />
        </AbsoluteFill>
      )}
    </Backdrop>
  );
};
