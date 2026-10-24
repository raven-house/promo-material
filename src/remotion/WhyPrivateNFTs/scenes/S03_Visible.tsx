import type React from "react";
import { Backdrop } from "../components/Backdrop";
import { WordWall } from "../components/WordWall";
import { copy } from "../copy";
import { shotLength } from "../timeline";

// Word wall: VISIBLE TO EVERYONE
export const S03_Visible: React.FC = () => (
  <Backdrop>
    <WordWall
      phrase={copy.S03.wall}
      highlight={copy.S03.highlight}
      highlightAlt="VISIBLE"
      bright={2}
      dur={shotLength("S03")}
      fontSize={112}
      seed="s03"
    />
  </Backdrop>
);
