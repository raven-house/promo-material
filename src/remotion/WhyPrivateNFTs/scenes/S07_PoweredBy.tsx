import type React from "react";
import { Backdrop } from "../components/Backdrop";
import { IsoNetwork } from "../components/Brand";
import { copy } from "../copy";
import { cues } from "../timeline";

// Isometric network builds out from the Aztec chip: POWERED BY / AZTEC
export const S07_PoweredBy: React.FC = () => (
  <Backdrop>
    <IsoNetwork
      top={copy.S07.top}
      bottom={copy.S07.bottom}
      textAt={cues.S07.text}
      zk={copy.S07.zk}
    />
  </Backdrop>
);
