import {
  AbsoluteFill,
  Audio,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const FillCollectionDetailsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const nameHighlight = interpolate(frame, [140, 150, 160, 170], [0, 1, 1, 0], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const symbolHighlight = interpolate(
    frame,
    [170, 190, 400, 450],
    [0, 1, 1, 0],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    },
  );

  const voucherAmountHighlight = interpolate(
    frame,
    [450, 460, 700, 720],
    [0, 1, 1, 0],
    {
      extrapolateRight: "clamp",
      extrapolateLeft: "clamp",
    },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "black" }}>
      <Audio src={staticFile("audio/scene4.mp3")} />

      <Img
        src={staticFile("img/fill-details.png")}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 180,
          left: 350,
          fontSize: 60,
          color: "#22c55e",
          opacity: nameHighlight,
          transform: `translateY(${-10 + Math.sin(frame * 0.2) * 5}px)`,
        }}
      >
        ↓
      </div>

      <div
        style={{
          position: "absolute",
          top: 180,
          left: 850,
          fontSize: 60,
          color: "#22c55e",
          opacity: symbolHighlight,
          transform: `translateY(${-10 + Math.sin(frame * 0.2) * 5}px)`,
        }}
      >
        ↓
      </div>

      <div
        style={{
          position: "absolute",
          top: 303,
          left: 150,
          fontSize: 60,
          color: "#22c55e",
          opacity: voucherAmountHighlight,
          transform: `translateX(${-10 + Math.sin(frame * 0.2) * 5}px)`,
        }}
      >
        →
      </div>
    </AbsoluteFill>
  );
};
