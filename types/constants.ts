import { z } from "zod";
export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  title: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;
export const INTRO_SOUND_IN_SECONDS = 8;
export const CREATE_BUTTON_SOUND_IN_SECONDS = 5;
export const SELECT_COLLECTION_TYPE_IN_SECONDS = 11;
export const DURATION_IN_FRAMES_INTRO = 120;
export const FILL_DETAILS_SOUND_IN_SECONDS = 25;
