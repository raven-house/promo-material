"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
import type { z } from "zod";
import {
  defaultMyCompProps,
  type CompositionProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { RenderControls } from "../components/RenderControls";
import { Spacing } from "../components/Spacing";
import { Tips } from "../components/Tips";
import { RavenHouseDemo } from "../remotion/MyComp/RavenHouseDemo";
import { RavenHouseIntro } from "../remotion/MyComp/RavenHouseIntro";
import { RavenHouseWithIntro } from "../remotion/MyComp/RavenHouseWithIntro";

type CompositionType = "intro" | "demo" | "combined";

const Home: NextPage = () => {
  const [text, setText] = useState<string>(defaultMyCompProps.title);
  const [selectedComposition, setSelectedComposition] =
    useState<CompositionType>("intro");

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      title: text,
    };
  }, [text]);

  const getComponent = () => {
    switch (selectedComposition) {
      case "intro":
        return RavenHouseIntro;
      case "demo":
        return RavenHouseDemo;
      case "combined":
        return () => (
          <RavenHouseWithIntro introDuration={240}>
            <RavenHouseDemo />
          </RavenHouseWithIntro>
        );
      default:
        return RavenHouseIntro;
    }
  };

  const getDuration = () => {
    switch (selectedComposition) {
      case "intro":
        return 240;
      case "demo":
        return DURATION_IN_FRAMES;
      case "combined":
        return DURATION_IN_FRAMES + 240;
      default:
        return 240;
    }
  };

  const getInputProps = () => {
    return selectedComposition === "demo" ? inputProps : {};
  };

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div className="mt-8 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Composition:
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedComposition("intro")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedComposition === "intro"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Intro Only
            </button>
            <button
              onClick={() => setSelectedComposition("demo")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedComposition === "demo"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Demo Only
            </button>
            <button
              onClick={() => setSelectedComposition("combined")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedComposition === "combined"
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Intro + Demo
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10">
          <Player
            component={getComponent()}
            inputProps={getInputProps()}
            durationInFrames={getDuration()}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{
              width: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>

        {selectedComposition !== "intro" && (
          <RenderControls
            text={text}
            setText={setText}
            inputProps={inputProps}
          />
        )}

        <Spacing />
        <Spacing />
        <Spacing />
        <Spacing />
        <Tips />
      </div>
    </div>
  );
};

export default Home;
