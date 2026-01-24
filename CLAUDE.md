# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Remotion + Next.js project for creating promotional video content for Raven House. It uses Remotion for programmatic video generation with React components and Next.js for the web interface/player.

## Commands

```bash
# Install dependencies
bun install

# Start Next.js dev server (web player interface)
bun run dev

# Open Remotion Studio (video editing/preview)
npx remotion studio

# Render video locally
bunx remotion render

# Run linter
bun run lint

# Deploy to AWS Lambda (after configuring .env)
node deploy.mjs

# Upgrade Remotion
bunx remotion upgrade
```

## Architecture

### Video Compositions

Video compositions are defined in `src/remotion/Root.tsx`. Each `<Composition>` registers a renderable video with an ID. Current compositions:

- `RavenHouseIntro` - Intro animation
- `RavenHouseDemo` - Product demo with screenshots
- `TopCollections`, `createButton`, `selectCollectionType`, `fillDetails` - Individual scene compositions

### Scene Components

Individual animated scenes live in `src/remotion/MyComp/`. Each scene is a React component that uses Remotion primitives:
- `AbsoluteFill`, `Sequence` for layout/timing
- `useCurrentFrame()`, `interpolate()`, `spring()` for animations
- `staticFile()` to reference assets from `/public`

### Video Constants

Frame rates, dimensions, and timing constants are defined in `types/constants.ts`:
- `VIDEO_FPS`: 30
- `VIDEO_WIDTH`: 1280, `VIDEO_HEIGHT`: 720
- Duration constants in frames and seconds for each scene

### Next.js Web Interface

- `src/app/page.tsx` - Main player page with composition selector
- `src/app/api/lambda/` - API routes for AWS Lambda rendering
- `src/components/` - UI components for the web player (RenderControls, ProgressBar, etc.)

### Static Assets

Place images, audio, and icons in `/public/img`, `/public/audio`, `/public/icons`. Reference them in Remotion components using `staticFile('/img/...')`.

### Lambda Rendering

AWS Lambda config is in `config.mjs` (region, RAM, timeout). Run `node deploy.mjs` after changing video templates or upgrading Remotion.

## ESLint Configuration

Uses flat config format (`eslint.config.mjs`). The Remotion ESLint plugin is applied only to files in `src/remotion/**`.
