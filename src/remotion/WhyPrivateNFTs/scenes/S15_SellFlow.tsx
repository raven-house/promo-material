import type React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { nftAt } from "../assets";
import { TiltedScreen } from "../components/Cards";
import {
  CollectionList,
  ListForSaleModal,
  NftDetail,
  OffersPanel,
} from "../components/UiReplica";
import { ip, useLayout } from "../components/util";
import { copy } from "../copy";
import { ui } from "../theme";
import { cues, shotLength } from "../timeline";
import { UI_STAGE, Word } from "./common";

const c = cues.S15;
const L = shotLength("S15");
const NFT = nftAt(23);

// My NFTs → NFT detail → List for Sale (types 25 USDC) → incoming offer accepted, on tilted planes
export const S15_SellFlow: React.FC = () => {
  const f = useCurrentFrame();
  const { portrait } = useLayout();
  const k = portrait ? 0.62 : 1;
  const typed = ip(f, [c.typed, c.typed + 10], [0, 1]);
  return (
    <AbsoluteFill style={{ background: UI_STAGE }}>
      <Word from={0} to={c.detail}>
        <TiltedScreen
          zoom={1.5}
          w={1500 * k}
          h={980 * k}
          keys={[
            { f: 0, rx: 24, ry: 14, rz: -6, z: -200, y: 60 },
            { f: c.detail, rx: 30, ry: 8, rz: -10, z: 120, y: -120 },
          ]}
          dof={{ angle: 0, focus: 0.45, blur: 4 }}
        >
          <div style={{ transform: `scale(${k})`, transformOrigin: "0 0" }}>
            <CollectionList
              title={copy.S15.profileTitle}
              rowsShown={ip(f, [0, 30], [1, 8])}
              shieldAt={9999}
              privateAt={9999}
              seed={9}
            />
          </div>
        </TiltedScreen>
      </Word>
      <Word from={c.detail} to={c.form}>
        <TiltedScreen
          zoom={1.2}
          w={1600 * k}
          h={900 * k}
          bg={ui.bg}
          keys={[
            { f: 0, rx: 26, ry: -12, rz: -8, z: 40, x: 60 },
            { f: c.form - c.detail, rx: 20, ry: -6, rz: -4, z: 220, x: -220 },
          ]}
          dof={{ angle: 0, focus: 0.5, blur: 4 }}
        >
          <div style={{ transform: `scale(${k})`, transformOrigin: "0 0" }}>
            <NftDetail
              nft={NFT}
              name={`${NFT.collection} ${NFT.name}`}
              collection={NFT.collection}
              price="—"
            />
          </div>
        </TiltedScreen>
      </Word>
      <Word from={c.form} to={c.offers}>
        <TiltedScreen
          zoom={1.9}
          w={900 * k}
          h={560 * k}
          bg={ui.bg}
          keys={[
            { f: 0, rx: 22, ry: 14, rz: -6, z: 0 },
            { f: c.offers - c.form, rx: 14, ry: 8, rz: -3, z: 180 },
          ]}
        >
          <div
            style={{
              transform: `scale(${k})`,
              transformOrigin: "0 0",
              padding: 70,
            }}
          >
            <ListForSaleModal typed={typed} submitAt={c.typed - c.form + 22} />
          </div>
        </TiltedScreen>
      </Word>
      <Word from={c.offers} to={L}>
        <TiltedScreen
          zoom={2.0}
          w={900 * k}
          h={400 * k}
          bg={ui.bg}
          keys={[
            { f: 0, rx: 18, ry: -14, rz: 4, z: 40 },
            { f: L - c.offers, rx: 10, ry: -6, rz: 1, z: 200 },
          ]}
        >
          <div
            style={{
              transform: `scale(${k})`,
              transformOrigin: "0 0",
              padding: 70,
            }}
          >
            <OffersPanel acceptAt={18} />
          </div>
        </TiltedScreen>
      </Word>
    </AbsoluteFill>
  );
};
