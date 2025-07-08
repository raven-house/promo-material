import type React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "500", "600", "700"],
});

export const RavenHouseIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Animation timings
  const logoStart = 0;
  const logoAnimDuration = 60;
  const titleStart = 40;
  const titleAnimDuration = 80;
  const subtitleStart = 80;
  const subtitleAnimDuration = 60;
  const taglineStart = 120;
  const taglineAnimDuration = 60;
  const fadeOutStart = 200;

  // Logo animation
  const logoScale = spring({
    fps,
    frame: frame - logoStart,
    config: { damping: 100, stiffness: 200 },
    durationInFrames: logoAnimDuration,
  });

  const logoOpacity = interpolate(
    frame,
    [logoStart, logoStart + 30, fadeOutStart, fadeOutStart + 30],
    [0, 1, 1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Title animation
  const titleProgress = spring({
    fps,
    frame: frame - titleStart,
    config: { damping: 200, stiffness: 300 },
    durationInFrames: titleAnimDuration,
  });

  const titleY = interpolate(titleProgress, [0, 1], [50, 0]);
  const titleOpacity = interpolate(
    frame,
    [titleStart, titleStart + 40, fadeOutStart, fadeOutStart + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Subtitle animation
  const subtitleProgress = spring({
    fps,
    frame: frame - subtitleStart,
    config: { damping: 150, stiffness: 200 },
    durationInFrames: subtitleAnimDuration,
  });

  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(
    frame,
    [subtitleStart, subtitleStart + 30, fadeOutStart, fadeOutStart + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Tagline animation
  const taglineProgress = spring({
    fps,
    frame: frame - taglineStart,
    config: { damping: 100, stiffness: 150 },
    durationInFrames: taglineAnimDuration,
  });

  const taglineScale = interpolate(taglineProgress, [0, 1], [0.8, 1]);
  const taglineOpacity = interpolate(
    frame,
    [taglineStart, taglineStart + 20, fadeOutStart, fadeOutStart + 30],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill className="bg-[#1B1122]">
      <AbsoluteFill className="flex items-center justify-center">
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
          className="mb-32"
        >
          <div className="relative mb-8">
            <Img
              src={staticFile("/img/raven-house-logo-sm.png")}
              className="w-1/2 mx-auto"
              style={{ opacity: logoOpacity }}
            />
          </div>
        </div>
      </AbsoluteFill>

      {/* Main Title */}
      <AbsoluteFill className="flex items-center justify-center">
        <div className="text-center mt-24">
          <h1
            style={{
              fontFamily,
              transform: `translateY(${titleY}px)`,
              opacity: titleOpacity,
            }}
            className="text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight"
          >
            <span>RAVEN HOUSE</span>
          </h1>
        </div>
      </AbsoluteFill>

      {/* Subtitle */}
      <AbsoluteFill className="flex items-center justify-center">
        <div className="text-center mt-32">
          <h2
            style={{
              fontFamily,
              transform: `translateY(${subtitleY}px)`,
              opacity: subtitleOpacity,
            }}
            className="text-2xl md:text-3xl font-medium text-gray-300 mb-4 mt-24"
          >
            Privacy-First NFT Platform
          </h2>
        </div>
      </AbsoluteFill>

      {/* Tagline */}
      <AbsoluteFill className="flex items-center justify-center">
        <div className="text-center mt-80">
          <p
            style={{
              fontFamily,
              transform: `scale(${taglineScale})`,
              opacity: taglineOpacity,
            }}
            className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed px-4"
          >
            Built on Aztec's zero-knowledge technology
            <br />
            <span className="text-purple-400 font-medium">
              for security and confidentiality
            </span>
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
