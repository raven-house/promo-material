import type React from "react";
import { AbsoluteFill, Easing, useCurrentFrame } from "remotion";
import { Backdrop } from "../components/Backdrop";
import { FallingCubes, NeonCubeField } from "../components/Cubes";
import { FlickerReveal } from "../components/FlickerReveal";
import { ip, range, useFit } from "../components/util";
import { copy } from "../copy";
import { headline } from "../theme";
import { shotLength } from "../timeline";

const L = shotLength("S04");
const ECHO = [
  "rgba(255,46,134,0.42)",
  "rgba(150,120,255,0.5)",
  "rgba(150,120,255,0.5)",
  "rgba(255,46,134,0.42)",
];

// FOREVER. — wide-spaced letters collapse in, dim echo rows, tumbling purple cubes
export const S04_Forever: React.FC = () => {
  const f = useCurrentFrame();
  const fs = useFit(copy.S04.word, 128, 800, "0.3em");
  const spacing =
    ip(f, [0, 9], [0.5, 0.04], Easing.out(Easing.cubic)) +
    ip(f, [L - 8, L], [0, 0.4], Easing.in(Easing.cubic));
  const echo = ip(f, [6, 14], [0, 1]) * ip(f, [L - 8, L - 2], [1, 0]);
  return (
    <Backdrop>
      <NeonCubeField count={5} seed="s04b" focus={0.5} />
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <div style={{ position: "relative", textAlign: "center" }}>
          {range(4).map((k) => {
            const row = k < 2 ? k - 2 : k - 1;
            return (
              <div
                key={k}
                style={{
                  ...headline,
                  fontSize: fs,
                  letterSpacing: `${spacing}em`,
                  position: "absolute",
                  left: "50%",
                  transform: `translateX(-50%) translateY(${row * fs * 1.05 * (0.9 + 0.1 * echo)}px)`,
                  color: "transparent",
                  WebkitTextStroke: `1.5px ${ECHO[k]}`,
                  opacity: echo,
                }}
              >
                {copy.S04.word}
              </div>
            );
          })}
          <FlickerReveal
            text={copy.S04.word}
            start={0}
            window={9}
            outStart={L - 9}
            outWindow={6}
            style={{ fontSize: fs, letterSpacing: `${spacing}em` }}
            seed="s04w"
          />
        </div>
      </AbsoluteFill>
      <FallingCubes count={4} seed="s04f" />
    </Backdrop>
  );
};
