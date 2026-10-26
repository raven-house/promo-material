import type React from "react";
import { Backdrop } from "../components/Backdrop";
import { LogoResolve } from "../components/Brand";
import { copy } from "../copy";
import { cues } from "../timeline";

const c = cues.S22;

// Blob → raven app icon → RAVEN HOUSE wordmark → ravenhouse.xyz
export const S22_LogoResolve: React.FC = () => (
  <Backdrop>
    <LogoResolve
      iconAt={c.icon}
      shrinkAt={c.shrink}
      urlAt={c.url}
      url={copy.S22.url}
    />
  </Backdrop>
);
