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

const logoStart = 0;
const logoAnimDuration = 25; // was 40
const titleStart = 25;
const titleAnimDuration = 40; // was 60
const subtitleStart = 55;
const subtitleAnimDuration = 30; // was 45
const taglineStart = 90;
const taglineAnimDuration = 25; // was 45
const fadeOutStart = 120; // was 160

export const RavenHouseIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    fps,
    frame: frame - logoStart,
    config: { damping: 80, stiffness: 250 }, // faster spring
    durationInFrames: logoAnimDuration,
  });

  const logoOpacity = interpolate(
    frame,
    [logoStart, logoStart + 20, fadeOutStart, fadeOutStart + 20],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const titleProgress = spring({
    fps,
    frame: frame - titleStart,
    config: { damping: 150, stiffness: 350 },
    durationInFrames: titleAnimDuration,
  });

  const titleY = interpolate(titleProgress, [0, 1], [50, 0]);
  const titleOpacity = interpolate(
    frame,
    [titleStart, titleStart + 30, fadeOutStart, fadeOutStart + 20],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const subtitleProgress = spring({
    fps,
    frame: frame - subtitleStart,
    config: { damping: 100, stiffness: 300 },
    durationInFrames: subtitleAnimDuration,
  });

  const subtitleY = interpolate(subtitleProgress, [0, 1], [30, 0]);
  const subtitleOpacity = interpolate(
    frame,
    [subtitleStart, subtitleStart + 25, fadeOutStart, fadeOutStart + 20],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const taglineProgress = spring({
    fps,
    frame: frame - taglineStart,
    config: { damping: 80, stiffness: 250 },
    durationInFrames: taglineAnimDuration,
  });

  const taglineScale = interpolate(taglineProgress, [0, 1], [0.8, 1]);
  const taglineOpacity = interpolate(
    frame,
    [taglineStart, taglineStart + 15, fadeOutStart, fadeOutStart + 20],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill className="bg-[#1B1122]">
      <div className="flex items-center justify-center">
        <div
          style={{
            transform: `scale(${logoScale})`,
            opacity: logoOpacity,
          }}
          className="mt-40"
        >
          <div className="relative mb-8">
            <Img
              src={staticFile("/img/raven-house-logo-sm.png")}
              className="w-1/2 mx-auto"
              style={{ opacity: logoOpacity }}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="text-center">
          <h1
            style={{
              fontFamily,
              transform: `translateY(${titleY}px)`,
              opacity: titleOpacity,
            }}
            className="text-6xl md:text-7xl font-bold text-white tracking-tight"
          >
            <span>RAVEN HOUSE</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="text-center">
          <h2
            style={{
              fontFamily,
              transform: `translateY(${subtitleY}px)`,
              opacity: subtitleOpacity,
            }}
            className="text-2xl md:text-3xl font-medium text-gray-300 mb-4 mt-20"
          >
            Privacy-First NFT Platform
          </h2>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="text-center">
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
      </div>
    </AbsoluteFill>
  );
};
