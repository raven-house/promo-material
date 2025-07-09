import { AbsoluteFill, Audio, Img, staticFile } from "remotion";

export const FillCollectionDetailsScene: React.FC = () => {
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
    </AbsoluteFill>
  );
};
