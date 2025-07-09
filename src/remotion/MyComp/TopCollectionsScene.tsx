import {
  AbsoluteFill,
  Img,
  Audio,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  staticFile,
} from "remotion";

export const TopCollectionsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const translateX = interpolate(frame, [0, durationInFrames], [0, 30]);
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05]);

  const voucherHighlight = interpolate(
    frame,
    [180, 200, 210, 230],
    [0, 1, 1, 0],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("audio/scene1-intro.mp3")} />
      <Img
        src={staticFile("img/top-collections.png")}
        style={{
          transform: `translateX(${translateX}px) scale(${scale})`,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 66,
          left: 100,
          fontSize: 60,
          color: "#22c55e",
          opacity: voucherHighlight,
          transform: `translateY(${-10 + Math.sin(frame * 0.2) * 5}px)`,
        }}
      >
        ↓
      </div>
    </AbsoluteFill>
  );
};
