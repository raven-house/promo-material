import type React from "react";
import {
  AbsoluteFill,
  Img,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { SCREENS } from "../assets";
import { TiltedScreen } from "../components/Cards";
import {
  BuyModal,
  NftDetail,
  ProofProgress,
  PurchaseSuccess,
} from "../components/UiReplica";
import { ip, useLayout } from "../components/util";
import { springs, ui } from "../theme";
import { cues, shotLength } from "../timeline";
import { UI_STAGE, Word } from "./common";

const c = cues.S12;
const L = shotLength("S12");
const VEILQUILL = {
  src: "wpn/nfts/00-veilquill-6.jpg",
  name: "#6",
  collection: "Rise of the Rivals",
  price: 10,
};

// Collection grid → NFT detail → Buy (replica) → zk proof → success, each on a tilted plane
export const S12_BuyFlow: React.FC = () => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { portrait } = useLayout();
  const k = portrait ? 0.62 : 1;
  const proofP = ip(f, [c.proof + 4, c.success - 4], [0, 1]);
  const successPop = spring({ frame: f - c.success, fps, config: springs.pop });
  return (
    <AbsoluteFill style={{ background: UI_STAGE }}>
      <Word from={0} to={c.detail}>
        <TiltedScreen
          zoom={1.7}
          w={1600 * k}
          h={1000 * k}
          keys={[
            { f: 0, rx: 30, ry: -6, rz: -12, z: 200, x: 0, y: 40 },
            { f: c.detail, rx: 26, ry: -4, rz: -8, z: 320, x: -120, y: -20 },
          ]}
          dof={{ angle: 0, focus: 0.35, blur: 5 }}
        >
          <Img
            src={staticFile(SCREENS.collectionFull)}
            style={{ width: 1600 * k, transform: `translateY(${-760 * k}px)` }}
          />
        </TiltedScreen>
      </Word>
      <Word from={c.detail} to={c.buy}>
        <TiltedScreen
          zoom={1.75}
          w={1600 * k}
          h={900 * k}
          keys={[
            { f: 0, rx: 22, ry: 18, rz: -6, z: -80, x: 140 },
            { f: c.buy - c.detail, rx: 16, ry: 10, rz: -3, z: 140, x: -60 },
          ]}
          dof={{ angle: 90, focus: 0.55, blur: 4 }}
        >
          <Img
            src={staticFile(SCREENS.nft)}
            style={{
              width: 1600 * k,
              height: 900 * k,
              objectFit: "cover",
              objectPosition: "50% 12%",
            }}
          />
        </TiltedScreen>
      </Word>
      <Word from={c.buy} to={c.proof}>
        <TiltedScreen
          zoom={1.55}
          w={1600 * k}
          h={900 * k}
          bg={ui.bg}
          keys={[
            { f: 0, rx: 14, ry: -16, rz: 2, z: 200, x: -360 * k, y: 120 },
            {
              f: c.proof - c.buy,
              rx: 10,
              ry: -10,
              rz: 1,
              z: 360,
              x: -420 * k,
              y: 60,
            },
          ]}
          dof={{ angle: 270, focus: 0.62, blur: 4 }}
        >
          <div style={{ transform: `scale(${k})`, transformOrigin: "0 0" }}>
            <NftDetail nft={VEILQUILL}>
              <BuyModal clickAt={16} width={772} />
            </NftDetail>
          </div>
        </TiltedScreen>
      </Word>
      <Word from={c.proof} to={c.success}>
        <TiltedScreen
          zoom={1.75}
          w={900 * k}
          h={620 * k}
          bg={ui.panel}
          keys={[
            { f: 0, rx: 18, ry: 12, rz: -4, z: 0 },
            { f: c.success - c.proof, rx: 10, ry: 6, rz: -2, z: 160 },
          ]}
        >
          <div
            style={{
              transform: `scale(${k})`,
              transformOrigin: "0 0",
              padding: 40,
            }}
          >
            <ProofProgress progress={proofP} width={820} />
          </div>
        </TiltedScreen>
      </Word>
      <Word from={c.success} to={L}>
        <TiltedScreen
          zoom={1.6}
          w={1100 * k}
          h={620 * k}
          keys={[
            { f: 0, rx: 12, ry: -8, rz: 2, z: 60 },
            { f: L - c.success, rx: 6, ry: -3, rz: 0, z: 220 },
          ]}
        >
          <div
            style={{
              transform: `scale(${k})`,
              transformOrigin: "0 0",
              padding: "40px 170px",
            }}
          >
            <PurchaseSuccess pop={successPop} />
          </div>
        </TiltedScreen>
      </Word>
    </AbsoluteFill>
  );
};
