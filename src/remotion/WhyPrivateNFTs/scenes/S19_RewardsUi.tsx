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
import { TiltedScreen } from "../components/Cards";
import { BubbleField } from "../components/Shapes";
import { VoucherCard } from "../components/UiReplica";
import { ip, useLayout } from "../components/util";
import { cues, shotLength } from "../timeline";
import { UI_STAGE, Word } from "./common";

const c = cues.S19;
const L = shotLength("S19");
const HOF = c.leaderboard + 26;

// Bubble field → Rewards page → RP Leaderboard (scrolling) → Hall of Fame → private voucher claim
export const S19_RewardsUi: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait } = useLayout();
  const k = portrait ? 0.56 : 1;
  const intro = ip(f, [0, 14], [0, 1], Easing.inOut(Easing.cubic));
  return (
    <Backdrop>
      <AbsoluteFill style={{ opacity: 1 - intro }}>
        <BubbleField
          seed="s19"
          marks={false}
          clearCenter={0.25}
          scale={1 + intro}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ background: UI_STAGE, opacity: intro }} />
      <Word from={0} to={c.leaderboard}>
        <TiltedScreen
          zoom={1.55}
          w={1600 * k}
          h={900 * k}
          keys={[
            { f: 0, rx: 8, ry: -10, rz: 3, z: -1100 },
            { f: 14, rx: 22, ry: -12, rz: 5, z: -40, y: 60 },
            { f: c.leaderboard, rx: 26, ry: -8, rz: 6, z: 160, y: -40 },
          ]}
          dof={{ angle: 0, focus: 0.5, blur: 4 }}
        >
          <Img
            src={staticFile(SCREENS.rewardsFull)}
            style={{
              width: 1600 * k,
              transform: `translateY(${ip(f, [6, c.leaderboard], [0, -360 * k])}px)`,
            }}
          />
        </TiltedScreen>
      </Word>
      <Word from={c.leaderboard} to={HOF}>
        <TiltedScreen
          zoom={1.6}
          w={1600 * k}
          h={900 * k}
          keys={[
            { f: 0, rx: 30, ry: 10, rz: -6, z: 60 },
            { f: HOF - c.leaderboard, rx: 26, ry: 6, rz: -4, z: 200 },
          ]}
          dof={{ angle: 0, focus: 0.5, blur: 4 }}
        >
          <Img
            src={staticFile(SCREENS.leaderboardFull)}
            style={{
              width: 1600 * k,
              transform: `translateY(${ip(f - c.leaderboard, [0, HOF - c.leaderboard], [-120 * k, -1000 * k])}px)`,
            }}
          />
        </TiltedScreen>
      </Word>
      <Word from={HOF} to={c.voucher}>
        <TiltedScreen
          zoom={1.4}
          w={1600 * k}
          h={900 * k}
          keys={[
            { f: 0, rx: 14, ry: -14, rz: 2, z: 40 },
            { f: c.voucher - HOF, rx: 10, ry: -8, rz: 1, z: 180 },
          ]}
        >
          <Img
            src={staticFile(SCREENS.hallOfFame)}
            style={{ width: 1600 * k, height: 900 * k, objectFit: "cover" }}
          />
        </TiltedScreen>
      </Word>
      <Word from={c.voucher} to={L}>
        <TiltedScreen
          zoom={1.6}
          w={740 * k}
          h={640 * k}
          bg="transparent"
          frame={false}
          keys={[
            { f: 0, rx: 20, ry: 16, rz: -5, z: -60 },
            { f: L - c.voucher, rx: 10, ry: 6, rz: -2, z: 140 },
          ]}
        >
          <div
            style={{
              transform: `scale(${k})`,
              transformOrigin: "0 0",
              padding: 50,
            }}
          >
            <VoucherCard claimAt={20} />
          </div>
        </TiltedScreen>
      </Word>
    </Backdrop>
  );
};
