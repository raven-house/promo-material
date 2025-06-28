import {
  AbsoluteFill,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";

export const RavenHouseDemo: React.FC = () => {
  const frame = useCurrentFrame();

  // Animations
  const logoOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const slideX = interpolate(frame, [60, 90], [200, 0], {
    extrapolateRight: "clamp",
  });
  const textOpacity = interpolate(frame, [90, 120], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="bg-gray-900 flex items-center justify-center">
      {/* Logo Section (0–2s) */}
      {frame < 60 && (
        <Img
          src={staticFile("/img/raven-house-logo-sm.png")}
          className="w-1/4 mx-auto mt-48"
          style={{ opacity: logoOpacity }}
        />
      )}
      {/* Feature Demo (2–10s) */}
      {frame >= 60 && (
        <div className="flex flex-col items-center">
          <Img
            src={staticFile("/img/feature-screenshot.png")}
            className="w-1/2"
            style={{ transform: `translateX(${slideX}px)` }}
          />
          <h2
            className="text-6xl text-white font-bold mt-8"
            style={{ opacity: textOpacity }}
          >
            Real-Time Collaboration
          </h2>
          <p
            className="text-2xl text-gray-300 mt-4"
            style={{ opacity: textOpacity }}
          >
            Powered by Raven House
          </p>
        </div>
      )}
    </AbsoluteFill>
  );
};
