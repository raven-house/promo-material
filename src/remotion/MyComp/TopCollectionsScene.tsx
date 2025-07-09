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

  const translateX = interpolate(frame, [0, durationInFrames], [0, 30]); // pan left
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05]); // slight zoom-in

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("audio/scene1-intro1.mp3")} />
      <Img
        src={staticFile("img/top-collections.png")}
        style={{
          transform: `translateX(${translateX}px) scale(${scale})`,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
    </AbsoluteFill>
  );
};
