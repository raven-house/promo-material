import type React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { TiltedScreen } from "../components/Cards";
import { BubbleField } from "../components/Shapes";
import { CollectionList } from "../components/UiReplica";
import { ip, useLayout } from "../components/util";
import { cues, shotLength } from "../timeline";
import { UI_STAGE } from "./common";

const c = cues.S17;
const L = shotLength("S17");

// "Your collection" builds row by row on a tilted plane; one row shields public → private
export const S17_Shield: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait } = useLayout();
  const k = portrait ? 0.62 : 1;
  const intro = ip(f, [0, 12], [0, 1], Easing.inOut(Easing.cubic));
  return (
    <Backdrop>
      <AbsoluteFill style={{ opacity: 1 - intro }}>
        <BubbleField
          seed="s17"
          ring={false}
          marks={false}
          clearCenter={0.25}
          scale={1 + intro}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: UI_STAGE, opacity: intro }} />
      <TiltedScreen
        zoom={1.35}
        w={1500 * k}
        h={1150 * k}
        keys={[
          { f: 0, rx: 0, ry: 0, rz: 0, z: -900, y: 0 },
          { f: 12, rx: 24, ry: -14, rz: 6, z: -60, y: 140 },
          { f: c.shield - 6, rx: 30, ry: -10, rz: 8, z: 120, y: 60 },
          { f: L, rx: 28, ry: -6, rz: 6, z: 240, y: -160 },
        ]}
        dof={{ angle: 0, focus: 0.55, blur: 4 }}
      >
        <div style={{ transform: `scale(${k})`, transformOrigin: "0 0" }}>
          <CollectionList
            rowsShown={ip(f, [10, 50], [0, 8])}
            shieldAt={c.shield}
            privateAt={c.private}
            shieldRow={3}
          />
        </div>
      </TiltedScreen>
    </Backdrop>
  );
};
