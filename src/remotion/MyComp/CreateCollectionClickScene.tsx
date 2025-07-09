import {
  AbsoluteFill,
  Audio,
  Img,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
} from "remotion";

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const CreateCollectionClickScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const progress = interpolate(frame, [40, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const easedProgress = easeOutCubic(progress);

  const cursorX = interpolate(easedProgress, [0, 1], [width / 2, 220]);
  const cursorY = interpolate(easedProgress, [0, 1], [height / 2, 30]);

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("audio/scene2-create-button.mp3")} />

      <Img
        src={staticFile("img/top-collections.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: cursorY,
          left: cursorX,
          width: 24,
          height: 24,
          borderRadius: "50%",
          transition: "transform 0.1s ease-in-out",
          zIndex: 10,
        }}
      >
        <Img src={staticFile("icons/cursor.png")} />
      </div>
    </AbsoluteFill>
  );
};
