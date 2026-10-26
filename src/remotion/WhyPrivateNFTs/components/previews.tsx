// Studio previews for every reusable WhyPrivateNFTs component (Folder "WPN-Components")
import { Gem, ShoppingBag } from "lucide-react";
import type React from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { nftAt, SCREENS } from "../assets";
import { colors, gridWord, headline } from "../theme";
import { Backdrop, Center } from "./Backdrop";
import { IsoNetwork, LogoResolve, LogoRing } from "./Brand";
import {
  CardGrid3D,
  CardMosaic,
  CardTunnel,
  NftCard,
  TiltedScreen,
} from "./Cards";
import { FallingCubes, HeroCube, NeonCubeField } from "./Cubes";
import { EchoStack } from "./EchoStack";
import { FlickerReveal } from "./FlickerReveal";
import { GlitchText } from "./GlitchText";
import { GridWord } from "./GridWord";
import { LoadingBar } from "./LoadingBar";
import {
  BauhausBackdrop,
  BubbleField,
  GradientCard,
  GradientWipe,
  Orb,
  OrbitRings,
} from "./Shapes";
import { WordWall } from "./WordWall";
import {
  BuyModal,
  CollectionList,
  ListForSaleModal,
  OffersPanel,
  ProofProgress,
  PurchaseSuccess,
  VoucherCard,
} from "./UiReplica";

const WordWallPreview: React.FC = () => (
  <WordWall
    phrase="A SINGLE CLICK AND"
    highlight="CLICK AND"
    bright={3}
    dur={60}
  />
);

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Backdrop>{children}</Backdrop>
);

export const PREVIEWS: Record<
  string,
  { component: React.FC; duration: number }
> = {
  GlitchText: {
    duration: 60,
    component: () => (
      <Stage>
        <Center>
          <GlitchText
            text="WELCOME"
            dur={60}
            inFrames={12}
            outFrames={10}
            style={{ ...gridWord, fontSize: 112 }}
          />
        </Center>
      </Stage>
    ),
  },
  FlickerReveal: {
    duration: 60,
    component: () => (
      <Stage>
        <Center>
          <FlickerReveal
            text="VISIBLE TO EVERYONE"
            highlight="EVERYONE"
            start={4}
            window={14}
            outStart={44}
            style={{ fontSize: 100 }}
          />
        </Center>
      </Stage>
    ),
  },
  GridWord: {
    duration: 60,
    component: () => (
      <Stage>
        <GridWord seed="pv" corners={{ w: 1200, h: 215 }}>
          <span style={{ ...gridWord, fontSize: 88 }}>DISCOVER</span>
        </GridWord>
      </Stage>
    ),
  },
  LoadingBar: {
    duration: 60,
    component: () => {
      const f = useCurrentFrame();
      return (
        <Stage>
          <Center>
            <LoadingBar progress={f / 60} />
          </Center>
        </Stage>
      );
    },
  },
  WordWall: {
    duration: 60,
    component: () => (
      <Stage>
        <WordWallPreview />
      </Stage>
    ),
  },
  EchoStack: {
    duration: 45,
    component: () => (
      <Stage>
        <Center>
          <EchoStack word="PRIVATE" fontSize={120} />
        </Center>
      </Stage>
    ),
  },
  NeonCubeField: {
    duration: 90,
    component: () => (
      <Stage>
        <NeonCubeField />
      </Stage>
    ),
  },
  HeroCube: {
    duration: 90,
    component: () => {
      const f = useCurrentFrame();
      return (
        <Stage>
          <NeonCubeField count={14} />
          <Center>
            <HeroCube
              rx={-16}
              ry={f * 2}
              Icon={Gem}
              ring={{
                angle: f * 6,
                color: colors.cyan,
                color2: colors.magenta,
              }}
            />
          </Center>
        </Stage>
      );
    },
  },
  HeroCubeSolid: {
    duration: 90,
    component: () => {
      const f = useCurrentFrame();
      return (
        <Stage>
          <Center>
            <HeroCube
              variant="solid"
              rx={-20}
              ry={f * 3}
              ring={{ angle: f * 7, color: colors.magenta, tilt: 64 }}
            />
          </Center>
        </Stage>
      );
    },
  },
  FallingCubes: {
    duration: 60,
    component: () => (
      <Stage>
        <FallingCubes count={8} />
      </Stage>
    ),
  },
  BauhausBackdrop: {
    duration: 60,
    component: () => (
      <Stage>
        <BauhausBackdrop />
      </Stage>
    ),
  },
  GradientCard: {
    duration: 60,
    component: () => (
      <Stage>
        <GradientCard
          Icon={ShoppingBag}
          clickAt={30}
          label={
            <FlickerReveal text="BUY" start={10} style={{ fontSize: 66 }} />
          }
        />
      </Stage>
    ),
  },
  GradientWipe: {
    duration: 30,
    component: () => (
      <Stage>
        <GradientWipe
          grow={[0, 10]}
          shrink={[14, 24]}
          target={{ w: 700, h: 430, x: 960, y: 540 }}
        />
      </Stage>
    ),
  },
  TiltedScreen: {
    duration: 90,
    component: () => (
      <Stage>
        <TiltedScreen
          w={1600}
          h={900}
          keys={[
            { f: 0, rx: 30, ry: -10, rz: -8, z: -200 },
            { f: 90, rx: 18, ry: 6, rz: -2, z: 100 },
          ]}
          dof={{ angle: 0, focus: 0.5, blur: 5 }}
        >
          <Img
            src={staticFile(SCREENS.home)}
            style={{ width: 1600, height: 900, objectFit: "cover" }}
          />
        </TiltedScreen>
      </Stage>
    ),
  },
  CardGrid3D: {
    duration: 120,
    component: () => (
      <CardGrid3D
        keys={[
          { f: 0, rx: 34, rz: -10, x: 520, y: 560, s: 1.5 },
          { f: 120, rx: 28, rz: -6, x: -260, y: 60, s: 1 },
        ]}
        focus={[
          [0, 900, 900],
          [120, 2000, 1500],
        ]}
      />
    ),
  },
  IsoNetwork: {
    duration: 66,
    component: () => (
      <Stage>
        <IsoNetwork top="POWERED BY" bottom="AZTEC" textAt={30} />
      </Stage>
    ),
  },
  LogoRing: {
    duration: 60,
    component: () => (
      <Stage>
        <Center>
          <LogoRing dotAt={0} discAt={10} />
        </Center>
      </Stage>
    ),
  },
  OrbitRings: {
    duration: 60,
    component: () => (
      <Stage>
        <OrbitRings />
        <AbsoluteFill>
          <Orb size={200} />
        </AbsoluteFill>
        <Center>
          <span style={{ ...headline, fontSize: 84 }}>ESCROW</span>
        </Center>
      </Stage>
    ),
  },
  BubbleField: {
    duration: 60,
    component: () => (
      <Stage>
        <BubbleField />
      </Stage>
    ),
  },
  CardMosaic: { duration: 90, component: () => <CardMosaic /> },
  CardTunnel: { duration: 90, component: () => <CardTunnel /> },
  LogoResolve: {
    duration: 200,
    component: () => (
      <Stage>
        <LogoResolve
          iconAt={21}
          shrinkAt={61}
          urlAt={102}
          url="ravenhouse.xyz"
        />
      </Stage>
    ),
  },
  NftCard: {
    duration: 30,
    component: () => (
      <Stage>
        <Center>
          <NftCard nft={nftAt(3)} width={320} />
        </Center>
      </Stage>
    ),
  },
  "UiReplica-BuyModal": {
    duration: 60,
    component: () => (
      <Stage>
        <Center>
          <BuyModal clickAt={30} />
        </Center>
      </Stage>
    ),
  },
  "UiReplica-ProofProgress": {
    duration: 60,
    component: () => {
      const f = useCurrentFrame();
      return (
        <Stage>
          <Center>
            <ProofProgress progress={f / 60} />
          </Center>
        </Stage>
      );
    },
  },
  "UiReplica-PurchaseSuccess": {
    duration: 30,
    component: () => (
      <Stage>
        <Center>
          <PurchaseSuccess pop={1} />
        </Center>
      </Stage>
    ),
  },
  "UiReplica-ListForSaleModal": {
    duration: 60,
    component: () => {
      const f = useCurrentFrame();
      return (
        <Stage>
          <Center>
            <ListForSaleModal typed={Math.min(1, f / 20)} submitAt={45} />
          </Center>
        </Stage>
      );
    },
  },
  "UiReplica-OffersPanel": {
    duration: 60,
    component: () => (
      <Stage>
        <Center>
          <OffersPanel acceptAt={30} />
        </Center>
      </Stage>
    ),
  },
  "UiReplica-CollectionList": {
    duration: 120,
    component: () => {
      const f = useCurrentFrame();
      return (
        <Stage>
          <Center>
            <CollectionList rowsShown={f / 6} shieldAt={60} privateAt={95} />
          </Center>
        </Stage>
      );
    },
  },
  "UiReplica-VoucherCard": {
    duration: 60,
    component: () => (
      <Stage>
        <Center>
          <VoucherCard claimAt={20} />
        </Center>
      </Stage>
    ),
  },
};
