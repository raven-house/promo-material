# "Why Private NFTs" launch video

An 83 s (2496 frames, 30 fps) Remotion video for the Raven House marketplace. Its motion language and edit rhythm follow a reference launch trailer. Code lives in `src/remotion/WhyPrivateNFTs/`.

## Preview

```bash
bunx remotion studio
```

- `WhyPrivateNFTs`: the 1920×1080 master.
- `WhyPrivateNFTsVertical`: the 1080×1920 cut. It uses the same timeline, and the scenes adapt through `useVideoConfig()`.
- `WhyPrivateNFTs/WPN-S01` … `WPN-S22`: each shot on its own, with grain and vignette.
- `WPN-Components/*`: a preview of every reusable component and UI replica.

In Studio the `music` prop defaults to `"scratch"`. The scratch track is the reference soundtrack at `public/reference/ref-audio.mp3`. It is git-ignored, it is only for locking timing, and it must never ship.

## Render

```bash
bun run render:wpn            # out/why-private-nfts.mp4 (h264, crf 16, music: licensed)
bun run render:wpn:vertical   # out/why-private-nfts-vertical.mp4
```

The `music` prop accepts `"scratch" | "licensed" | "none"`, and `sfx` (boolean) turns the whoosh layer on or off. If the chosen music file isn't in `public/`, the video renders silent and does not fail. With `"licensed"`, the music fades out over the last 2 s.

## Swapping in the licensed music

1. Drop the licensed track at `public/audio/launch-music.mp3`.
2. If it's a different song from the scratch track, re-measure the beat grid:
   ```bash
   python3 -m venv /tmp/beat && /tmp/beat/bin/pip install librosa
   /tmp/beat/bin/python -I - public/audio/launch-music.mp3 <<'PY'
   import sys, librosa, numpy as np
   y, sr = librosa.load(sys.argv[1]); tempo, beats = librosa.beat.beat_track(y=y, sr=sr, units='time')
   env = librosa.onset.onset_strength(y=y, sr=sr); on = librosa.onset.onset_detect(onset_envelope=env, sr=sr, units='time')
   s = env[librosa.time_to_frames(on, sr=sr)]; print(tempo, np.median(np.diff(beats)), beats[0])
   print([round(t, 2) for t, v in zip(on, s) if v >= np.percentile(s, 80)])
   PY
   ```
3. In `timeline.ts`, update `BPM`, `BEAT_SEC`, `FIRST_BEAT_SEC` and `ONSETS`. Every cue is written as `snap(<reference seconds>)`, so cues re-snap to the new grid on their own. Shot boundaries in `SHOTS` are plain frame numbers, so move any that no longer fall on a beat.
4. Check alignment with `bun reference/timing-check.ts` (prints Δ frames per cue; keep it ≤ 2). This needs the git-ignored `reference/` folder.

## Where things live

| What | File |
|---|---|
| Every on-screen string | `copy.ts` |
| Shot table, beat grid, `beatFrame()`, `snap()`, cue frames | `timeline.ts` |
| Colours, gradient, springs, type styles, app UI tokens | `theme.ts` |
| Screenshot, NFT art, logo and audio paths | `assets.ts` |
| Reusable motion components | `components/*.tsx` |
| Replicas of wallet-gated app flows | `components/UiReplica/index.tsx` |
| Shots | `scenes/S01_Welcome.tsx` … `scenes/S22_LogoResolve.tsx` |

Assets are in `public/wpn/`. `screens/` holds captures of app.ravenhouse.xyz with wallet addresses, usernames and avatars blurred and the testnet-congestion banner hidden. `nfts/` holds 90 NFT images from public collection pages plus `frontend-app/public/img/collections`. `logos/` holds the raven mark and wordmark (cut from `raven_house_logo.svg`) and the Aztec and Azguard logos.

## Accuracy notes

Every product claim maps to a contract function:

- **Buy / Sell / offers**: the escrow contract's `create_listing`, `buy`, `create_offer` and `accept_offer`. These are public calls (USDC and NFT move with `transfer_public_to_public`), so the purchase success screen says "It's yours." and points to shielding, not privacy.
- **Keep your collection private**: shielding with `transfer_public_to_private` (S17). Private transfers use `transfer_private_to_private`.
- **Vouchers**: `claim_voucher_private` pays the voucher out to a private balance (S19).
- **"NOW LIVE ON AZTEC ALPHA MAINNET"**: the launch network line; change it in `copy.S21.network`.
