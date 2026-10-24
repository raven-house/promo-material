# Prompt: "Why Private NFTs" launch video for Raven House (Remotion, end to end)

> Paste everything below this line into Claude Code, started from `raven-house/promo-material/`.

---

You are building a ~83 second launch video for **Raven House**, a privacy-first NFT marketplace on Aztec L2, in this Remotion project (`promo-material/`). The video must copy the **motion language, pacing and edit rhythm** of a reference launch video (Ultra's "Uniq Marketplace" trailer) almost shot-for-shot, but with Raven House branding, Raven House product UI and a "Why Private NFTs" story.

Work autonomously through every phase below. Don't stop to ask questions. Where something is ambiguous, pick the option that looks closest to the reference and note it in the final summary. You are done when `out/why-private-nfts.mp4` renders cleanly and you have compared it frame-by-frame against the reference.

## 0. Inputs and ground rules

- **Reference video**: `../raven-house-app/launchVideoReference.mp4` (1920×1080, 30 fps, 83.17 s, AAC stereo). Copy it to `promo-material/reference/launchVideoReference.mp4`. Add `/reference/` and `/public/reference/` to `.gitignore`. Never commit the reference video or its audio.
- **Music licensing (hard rule)**: the reference soundtrack belongs to someone else. You may use it **only as a scratch track** to lock timing during development. Extract it with `ffmpeg -i reference/launchVideoReference.mp4 -vn -ac 2 -b:a 192k public/reference/ref-audio.mp3`. The final deliverable plays `public/audio/launch-music.mp3`, a licensed track the team will drop in. If that file is missing at final-render time, render with `music: "none"` and say so in your summary. Don't look for, download or bundle the track from anywhere else.
- **Determinism**: every animation must be driven by `useCurrentFrame()`. That means no CSS animations or transitions, no `Math.random()` (use `random(seed)` from `remotion`), and no `Date`. All images go through `<Img>` and `staticFile()`. Fonts load through `@remotion/google-fonts` so rendering waits for them.
- **Code style**: match the existing project (TypeScript, functional components, inline styles or Tailwind v4 classes as in `src/remotion/MyComp/RavenHouseVideo1`). Keep every on-screen string in one `copy.ts`, all timings in one `timeline.ts` and all colors and springs in one `theme.ts`.

## 1. Dependencies (you may upgrade)

1. Run `bunx remotion upgrade` to move every `remotion` / `@remotion/*` package to the latest 4.x. All of them must stay on the same exact version. Then run `bun install`.
2. Add these, pinned to that same Remotion version: `@remotion/noise` (organic drift), `@remotion/motion-blur` (`CameraMotionBlur` on whip moves), `@remotion/layout-utils` (`fitText`), plus `lucide-react` (line icons inside cards and cubes). No three.js: build all 3D with CSS 3D transforms (`perspective`, `preserve-3d`).
3. Make sure `bunx remotion studio` still opens and the existing compositions still load.

## 2. Analyze the reference before writing code

Use ffmpeg to extract stills into `reference/frames/` at every timestamp listed in §5 (`ffmpeg -ss <t> -i … -frames:v 1`), and a 2 fps contact sheet per scene. Look at them. They are the target for the comparisons in §8.

**Music facts (already measured, but re-verify)**: ~**89.1 BPM**, beat ≈ **0.673 s ≈ 20.2 frames**, first downbeat at **0.09 s**. The music body runs to ~76 s, fades from 76–80 s, and is silent from 80–83.2 s. Strong onsets (s): 3.95, 4.5, 5.55, 6.9, 8.89, 11.63, 12.79, 14.23, 16.56, 18.23, 19.23, 20.9, 22.22, 23.22, 24.89, 26.89, 28.56, 29.56, 31.56, 33.39, 34.9, 36.9, 39.06, 40.89, 42.56, 44.4, 46.23, 47.55, 49.23, 50.9, 52.9, 54.89, 56.24, 58.24, 60.23, 62.23, 63.9, 65.74, 67.57, 70.24, 71.56, 73.56, 74.91. Hard cuts (s): 8.2, 11.4, 19.3, 28.7, 30.9, 38.6, 43.2, 47.8, 53.8, 57.3, 61.6, 64.2, 69.2.

Put a `beatFrame(n) = Math.round((0.09 + n * 0.6734) * 30)` helper in `timeline.ts`, and snap every word-swap, pop and cut to a beat or a listed onset. If the licensed track is a different song, re-run onset detection on it (a Python venv with `librosa`, run with `python -I`), regenerate the beat constants, and re-snap.

## 3. Brand system (`theme.ts`)

- **Background**: deep indigo-violet, `#0E0A22` → radial center `#1A1238`. Add a very subtle film grain (an SVG feTurbulence overlay at 4% opacity, seed changing per frame) and a soft vignette.
- **Core purple** (the reference's main purple, used for orbs, cards and buttons): `#7B5CF0`. **Lavender** highlight text: `#B9A3FF`. **Raven deep purple** (Raven House app primary): `#5F3C77`.
- **Neon accents** (as in the reference): cyan `#2EE6F0`, magenta `#FF2E86`.
- **Signature gradient** (cards, wipes): `linear-gradient(135deg, #2EE6F0 0%, #7B5CF0 55%, #6A3FD8 100%)`.
- **Text**: white `#FFFFFF`. Dim echo / outline text `rgba(255,255,255,0.18)` or `-webkit-text-stroke: 1.5px rgba(185,163,255,0.35); color: transparent`.
- **Type**: Inter via `@remotion/google-fonts/Inter`, weights 600/800/900, always UPPERCASE. Headlines are ExtraBold with 0.02em tracking. "Grid words" (like ULTRAVERSE / DISCOVER) are Bold with 0.18em tracking.
- **Logos**: `public/img/raven-house-logo-sm.png` (raven head mark, 274 px). Also copy `../raven-house-app/frontend-app/public/img/raven_house_logo.svg` (wordmark) and `logo.svg`. Copy `../raven-house-app/frontend-app/public/icons/aztec-small.png` and `promo-material/public/img/video1/aztec-logo.png` for the Aztec chip. If you need a crisper raven mark, trace or upscale from the SVG sources.
- **Springs**: reuse `springConfigs` from `RavenHouseVideo1/styles.ts` and add `pop: { damping: 12, stiffness: 180 }` and `whip: { damping: 30, stiffness: 300 }`.

## 4. Reusable components (`src/remotion/WhyPrivateNFTs/components/`)

Build these first. Each one gets a Studio preview composition under a `<Folder name="WPN-Components">`.

| Component | Behaviour (match the reference) |
|---|---|
| `GlitchText` | RGB split (cyan/magenta copies offset ±4–10 px), 2–4 horizontal slice displacements, and character scramble from a seeded alphabet. Props: `inFrames`, `outFrames`, `intensity`. Used for type-in/out between words (e.g. WELCOME→TO, INTRODUCING→THE, logo wordmark). |
| `FlickerReveal` | Per-letter reveal: each letter flips on at a seeded random frame within a window. Before it lands it shows as dim/outline, sometimes swapped to a wrong glyph. Supports `highlight` ranges in lavender (e.g. "NEXT-**GENERATION**"). |
| `GridWord` | A word centered in a faint grid of square cells (≈44 px, 1 px lines in purple/magenta/cyan at 20–30% opacity, a few cells lit). Four small hollow corner squares (cyan + purple) frame it. Two **diagonal hatch strips** (top and bottom, `/ / / /` pattern) slide horizontally. Used in the WELCOME and DISCOVER/BUY/SELL/SHARE sections. |
| `LoadingBar` | Rounded pill under the intro word: purple track, fill of cyan diagonal stripes that scroll and grow with progress. |
| `WordWall` | Full-frame rows of a repeated phrase. Alternate rows scroll opposite ways. Most rows are outline/dim, and 1–3 center rows are bright white with lavender highlight spans and letter flicker. Fades in from the dim state. |
| `EchoStack` | A solid word with 2 outlined copies directly above and below that slide apart and fade (as on EXCLUSIVE, PLATFORM, SECONDS). |
| `NeonCube` / `NeonCubeField` | CSS 3D wireframe cube (6 transparent faces, 3 px glowing borders through layered `box-shadow`) in cyan/magenta/purple. The field holds 18–26 cubes at seeded positions and depths. They drift and rotate with `@remotion/noise`, and depth controls blur (0–8 px), scale and opacity. |
| `HeroCube` | A large wireframe cube, center frame, rotating, with a glowing lucide icon floating inside and an orbit ring sweeping around it. Variant `solid`: a gradient-faced glass cube with the raven mark or an icon on a face. Can whip toward the camera (scale-up plus `CameraMotionBlur`) as a transition. |
| `FallingCubes` | Solid purple/violet cubes tumbling through frame with motion blur (the ENTERTAINMENT shot). |
| `BauhausBackdrop` | Slabs of purple-gradient half-circles, quarter-circles and rectangles sliding in a mosaic (the PLATFORM shot). |
| `GradientCard` | Signature-gradient rounded card with a white line icon, with 3–6 satellite cards (some with magenta/cyan edge glints) popping in staggered. A label below uses `FlickerReveal`. An optional cursor click animates on the icon (BUY / SELL shots). |
| `GradientWipe` | A full-frame signature-gradient shape with concave curved left/right edges (an hourglass silhouette) that expands to cover the frame and then reveals the next scene. |
| `TiltedScreen` | Shows an app screenshot or replica panel on a 3D-tilted plane (rounded 16 px corners, 1 px lavender edge, soft purple glow). Keyframed camera props `rotateX/rotateY/rotateZ/translateZ/x/y` are interpolated with `Easing.inOut(Easing.cubic)`, plus a **depth-of-field** imitation (layered copies with progressive blur, or a gradient-masked blur on the far edge). |
| `CardGrid3D` | An infinite-looking grid of NFT cards (image, name, collection, price pill, purple "Buy" button) on a tilted plane. The camera dollies and pans across it with DOF focus that moves (0:13–0:19 and 0:31–0:32 in the reference). |
| `IsoNetwork` | Isometric scene: faint iso grid floor, 10–14 small wireframe iso cubes (cyan/magenta/purple) linked by lines that draw on with `evolvePath` from `@remotion/paths`, small glowing data dots travelling the links, and a central glowing **chip slab** carrying the Aztec logo. Text sits on the iso plane (`rotateX(55deg) rotateZ(-35deg)`-ish). |
| `LogoRing` | A circular badge with the raven mark on a purple disc, inside 2–3 concentric thin rings (one dashed or ticked) rotating at different speeds, and a label below. |
| `OrbitRings` | Big partial arcs (gradient strokes cyan→purple→magenta, 8–24 px thick) at different radii, rotating at different speeds with small dot nodes at their ends. Variant `orb`: a filled glowing purple circle behind a word (the AND / GET THE MOST shots). |
| `BubbleField` | Drifting circles of mixed sizes and gradients (purple, magenta, cyan). Some contain the raven mark. One large thin ring frames the center word. |
| `CardMosaic` | 3 parallax depth layers of floating NFT cards, with blur on the near and far layers (ONE PLACE / ALL DIGITAL GOODS shot). |
| `CardTunnel` | Mirrored floor and ceiling planes of NFT cards in strong perspective, scrolling toward the camera, with a dark band in the middle for text (LAUNCHING ON THE shot). |
| `LogoResolve` | A purple squircle blob that grows, rotates and settles into an app-icon squircle with the raven mark. It then shrinks and slides left while the wordmark types in with `GlitchText`, and the URL fades in below. |
| `UiReplica/*` | Pixel-faithful React replicas of the Raven House wallet-gated flows (see §6). |

## 5. Shot list: `WhyPrivateNFTs` (1920×1080, 30 fps, **2496 frames**)

Frame numbers are at 30 fps. "Ref" describes what the reference does in that slot, so copy the motion exactly; "RH" is what to show instead. The voice-over-free copy reads as one sentence across shots:

> *Welcome to the public ledger. Your art. Your trades. Your wallet. Visible to everyone. Forever. Go private. — Powered by Aztec. Introducing the Raven House marketplace. A single click and it's yours. Buy. — And keep your collection private. Sell, with escrow-backed trades. — One home for private collectors. — Unlock memberships and rewards. — Discover. Mint. Trade. Own. Now live on Aztec testnet. Raven House.*

| # | Frames (s) | Ref | RH |
|---|---|---|---|
| S01 | 0–90 (0–3.0) | Grid backdrop with hatch strips. "WELCOME" glitches in over a loading bar; glitch to "TO" (2.0); "ULTRAVERSE" flickers in with wide tracking (2.5); bar fills with cyan stripes. | `GridWord` + `LoadingBar`: **WELCOME** → **TO THE** → **PUBLIC LEDGER**. Glitch transitions between them. |
| S02 | 90–246 (3.0–8.2) | `NeonCubeField`; a wireframe hero cube with an icon inside rotates; word below flickers: GAMES (4.0) → IN-GAMES ASSETS (5.0) → UNIQ COLLECTIBLES (6.0). Then a solid branded cube with orbit ring spins (6.5–7.5) and whips into camera; flash to dark at 8.0. | Hero cube icons and words: `Image` icon **YOUR ART** → `ArrowLeftRight` **YOUR TRADES** → `Wallet` **YOUR WALLET**. Then a solid glass cube with a magenta-tinted `Eye` icon (surveillance) and a magenta orbit ring, which whips into camera. |
| S03 | 246–300 (8.2–10.0) | `WordWall` "A NEXT-GENERATION", 2 bright rows with partial lavender highlight. | `WordWall` **VISIBLE TO EVERYONE** (highlight "EVERYONE"). |
| S04 | 300–342 (10.0–11.4) | Single word "ENTERTAINMENT" with dim echo rows, `FallingCubes`, a few neon cubes. | **FOREVER.** with the same treatment. |
| S05 | 342–390 (11.4–13.0) | `BauhausBackdrop` with a centered `GradientCard` holding an `EchoStack` "PLATFORM" whose letters flicker; the card then pushes in toward the camera. | **GO PRIVATE** in the gradient card. The push-in reveals S06. |
| S06 | 390–579 (13.0–19.3) | A tiny marketplace screenshot inside the bubble/shape field zooms to full frame (13.0), then `CardGrid3D` dolly with DOF across NFT cards (13.5–19.3), with the focus racking. | Real Raven House home/collection screenshot zoom, then `CardGrid3D` built from real Raven House NFT images and Raven House card chrome. |
| S07 | 579–645 (19.3–21.5) | `IsoNetwork` builds out from the chip; "POWERED BY / BLOCKCHAIN" on the iso plane. | Chip carries the **Aztec** logo; text **POWERED BY / AZTEC**. Tiny "zk" glyphs pulse on 3 nodes. |
| S08 | 645–720 (21.5–24.0) | Glitch → "INTRODUCING" with corner brackets (22.0) → glitch → "THE" `GridWord` (23.0) → a dot grows into a ring (23.5). | **INTRODUCING** → **THE** → ring. |
| S09 | 720–780 (24.0–26.0) | `LogoRing` with the Uniq mark, label "UNIQ MARKETPLACE", whose label glitches out (25.0). | `LogoRing` with the raven mark, label **RAVEN HOUSE MARKETPLACE**. |
| S10 | 780–861 (26.0–28.7) | `WordWall` "A SINGLE CLICK AND" (3 bright rows); glitch → "BOOM" `EchoStack` with RGB split (27.0–28.5). | **A SINGLE CLICK AND** → **IT'S YOURS**. |
| S11 | 861–927 (28.7–30.9) | `GradientWipe` → `GradientCard` with a shopping-bag icon and cursor click, label "BUY". | Same, `ShoppingBag` icon, **BUY**. |
| S12 | 927–1158 (30.9–38.6) | Grid → NFT detail page tilted (32.5) → purchase flow panels, one at a time on tilted planes: "Purchase on…" (34.0), price slab (35.5), payment method (36.0), success check "Your purchase is now complete" (37.5). | Raven House collection grid → NFT detail page → `UiReplica/BuyModal` (price in USDC, Azguard wallet row) → `UiReplica/ProofProgress` ("Generating zero-knowledge proof…" ring) → success **"It's yours, privately."** |
| S13 | 1158–1296 (38.6–43.2) | "AND" on an orb (38.6) → "GET THE MOST" on an orb (39.5) → `OrbitRings` + `EchoStack` "EXCLUSIVE" (40.0–41.5) → `BubbleField`, "U N I Q S" spaced letters collapse into "UNIQS" (41.5–43.0). | **AND** → **KEEP YOUR** → **COLLECTION** → **P R I V A T E** collapsing into **PRIVATE** (bubbles carry raven marks). |
| S14 | 1296–1434 (43.2–47.8) | `GradientWipe` → `GradientCard` with a tag icon, "SELL" (43.5–45.5) → "WITH" (45.5) → `OrbitRings` "TRANSACTIONS" (46.0) → "WITHIN" (46.5) → "SECONDS" echo (47.0) → fades. | **SELL** (`Tag` icon) → **WITH** → **ESCROW** → **BACKED** → **TRADES**. |
| S15 | 1434–1614 (47.8–53.8) | "Sell your NFT" inventory list tilted → NFT detail → sell form with price input and slider, then a submit-button highlight. | Raven House profile "My NFTs" → NFT detail → `UiReplica/ListForSaleModal` (price input types "25 USDC", fee rows, **Create listing**) → `UiReplica/OffersPanel` showing an incoming offer with **Accept**. |
| S16 | 1614–1719 (53.8–57.3) | `CardMosaic`; "ONE PLACE" (54.0) → "FOR" (55.5) → "ALL DIGITAL GOODS" (56.5) with flicker swaps. | **ONE HOME** → **FOR** → **PRIVATE COLLECTORS**. |
| S17 | 1719–1848 (57.3–61.6) | Tilted "Your Inventory" list builds row by row; one row highlights with a "Finalizing the transaction…" spinner. | `UiReplica/CollectionList` "Your collection". Rows carry public/private badges; one row shows **Shielding…** with a spinner, then flips to a lock badge "Private". (Shielding = `transfer_public_to_private`.) |
| S18 | 1848–1926 (61.6–64.2) | Blurred `NeonCubeField`; "GAIN" → "ULTIMATE PERKS" → "AND" → a gift cube pops (with confetti lines), "REWARDS". | **UNLOCK** → **MEMBERSHIPS** → **AND** → gift-cube **REWARDS**. |
| S19 | 1926–2076 (64.2–69.2) | `BubbleField` with a small wallet screenshot zooming in → tilted wallet page: balance, "Send", transaction history rows with prices, camera sliding down the list. | Raven House **Rewards / Leaderboard** and **Hall of Fame** screenshots, plus `UiReplica/VoucherCard` (Discord/Telegram membership voucher claimed privately). |
| S20 | 2076–2199 (69.2–73.3) | A swoosh line draws "DISCOVER"; then `GridWord` beats: DISCOVER (69.5) → BUY (70.5) → SELL (71.5) → SHARE (72.5), each glitching in and out. | **DISCOVER** → **MINT** → **TRADE** → **OWN**. |
| S21 | 2199–2295 (73.3–76.5) | `CardTunnel`; "LAUNCHING ON THE" (73.5) → "29TH OF AUGUST" (75.0) → glitch out. | **NOW LIVE ON** → **AZTEC TESTNET** (both strings editable in `copy.ts`). |
| S22 | 2295–2496 (76.5–83.2) | `LogoResolve`: blob (76.5) → icon squircle (77.0) → shrink + wordmark glitch-type (78.5) → URL fades in (80.0) → hold. | Raven mark → **RAVEN HOUSE** wordmark → **ravenhouse.xyz**. |

Between shots, use the reference's transition grammar: hard cuts on beats, glitch cuts between words, a whip plus `CameraMotionBlur` (shutterAngle ~180, samples 6–10) on cube or camera moves, and `GradientWipe` into BUY/SELL. Don't add transitions the reference doesn't have.

## 6. Product visuals: real Raven House UI

1. **Screenshots** (no wallet needed): use Playwright (install `playwright` as a dev dep in a scratch folder, not in `promo-material` deps) at 1920×1080 with `deviceScaleFactor: 2`, dark mode. Capture `https://app.ravenhouse.xyz` pages: home, a populated collection page, an NFT detail page, `/rewards`, `/rewards/leaderboard`, `/hall-of-fame`, `/collection/create`. If the live site is unreachable, run `../raven-house-app/frontend-app` locally with `NEXT_PUBLIC_NETWORK=TESTNET bun dev`. Blur or replace any real wallet addresses or usernames. Save to `public/wpn/screens/`. Existing captures in `public/img/video1/` can fill gaps.
2. **NFT art**: collect at least 40 distinct NFT images from those pages (read `<img>` srcs through Playwright) into `public/wpn/nfts/`. Supplement with `../raven-house-app/frontend-app/public/img/collections/*`. Don't use the reference video's artwork.
3. **Replicas**: wallet-gated flows (`BuyModal`, `ProofProgress`, `ListForSaleModal`, `OffersPanel`, `CollectionList`, `VoucherCard`) are built as React components in `components/UiReplica/`. Copy the real app's look: read the matching components in `../raven-house-app/frontend-app/src/components/` and its `globals.css` (background `hsl(252,24%,4%)`, primary `hsl(276,33%,35%)`, Inter). Keep their text, layout and spacing faithful so they read as the actual product. USDC amounts use 6-decimal display such as `25.00 USDC`.
4. **Accurate claims only**: everything shown must exist in the contracts: private mint (`mint_private`), private transfers (`transfer_private_to_private`), shield/unshield (`transfer_public_to_private` / `transfer_private_to_public`), whitelist mint, escrow listings, buy and offers (`create_listing`, `buy`, `create_offer`, `accept_offer`), and private voucher claims (`claim_voucher_private`). Don't invent features, stats or prices beyond plausible demo values.

## 7. Audio

- `<Audio>` music layer chosen by a composition prop `music: "scratch" | "licensed" | "none"` (zod schema). Studio defaults to `"scratch"` (`public/reference/ref-audio.mp3`) when that file exists. Final render uses `"licensed"` (`public/audio/launch-music.mp3`). Fade the music out over the last 2 s if the licensed track runs longer than the video.
- An optional SFX layer reuses `public/audio/whoosh.mp3` on whip moves and the gradient wipes at volume 0.25. Only add more SFX if they're royalty-free and already in the repo.

## 8. Structure, registration, verification

```
src/remotion/WhyPrivateNFTs/
  index.tsx        # main composition, <Sequence>s driven by timeline.ts
  timeline.ts      # SHOTS table + beatFrame()
  theme.ts  copy.ts
  components/…     # §4
  scenes/S01_Welcome.tsx … S22_LogoResolve.tsx
```

- Register in `src/remotion/Root.tsx`: `WhyPrivateNFTs` (1920×1080, 30 fps, 2496 frames). Register each scene as `WPN-S01`…`WPN-S22` inside `<Folder name="WhyPrivateNFTs">`, and add the component previews.
- Build in this order and check after each block: components → S01–S07 → S08–S14 → S15–S22.
- **Visual diff loop** (mandatory): for each shot, run `bunx remotion still WhyPrivateNFTs reference/compare/<t>-ours.png --frame=<f>` at the same timestamps you extracted in §2. Build side-by-side sheets with ffmpeg (`hstack`), view them, and fix anything that diverges in composition, scale, color weight, text size or motion state. Do at least 2 passes over the whole timeline.
- **Timing check**: render a low-res preview (`--scale=0.5`) with `music: "scratch"` and confirm that every word swap and cut lands within ±2 frames of its beat or onset.
- Run `bunx tsc --noEmit` and `bun run lint` with zero new errors.

## 9. Deliverables

1. **Master**: `bunx remotion render WhyPrivateNFTs out/why-private-nfts.mp4 --codec=h264 --crf=16 --props='{"music":"licensed"}'` (or `"none"` if the licensed file isn't there). Add `out/` to `.gitignore` if it isn't already.
2. **Vertical cut**: `WhyPrivateNFTsVertical` (1080×1920, same timeline). Make scenes layout-aware through `useVideoConfig()`: text scales with `fitText`, grids and tunnels recompose for portrait, and screenshots crop to the relevant panel. Render it to `out/why-private-nfts-vertical.mp4`.
3. Add `package.json` scripts `render:wpn` and `render:wpn:vertical`.
4. Add a short `docs/why-private-nfts.md` covering how to preview, how to swap the music and re-snap beats, and where the copy lives.
5. Final summary: what you built, any shot that still differs noticeably from the reference and why, and anything the team must supply (licensed music file, confirmation of the "NOW LIVE ON AZTEC TESTNET" line).
