// All timing for WhyPrivateNFTs lives here. Frames are at 30 fps.
// Beat grid measured from the scratch track (librosa): 89.1 BPM, first downbeat 0.09 s.
// If the licensed track differs, re-run onset detection and replace BPM / FIRST_BEAT / ONSETS.

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const DURATION = 2496;

export const BPM = 89.1;
export const BEAT_SEC = 0.6734;
export const FIRST_BEAT_SEC = 0.09;

// Frame of beat n (fractional n allowed for half-beats)
export const beatFrame = (n: number) =>
  Math.round((FIRST_BEAT_SEC + n * BEAT_SEC) * FPS);

// Strong onsets (s) of the scratch track
export const ONSETS = [
  3.95, 4.5, 5.55, 6.9, 8.89, 11.63, 12.79, 14.23, 16.56, 18.23, 19.23, 20.9,
  22.22, 23.22, 24.89, 26.89, 28.56, 29.56, 31.56, 33.39, 34.9, 36.9, 39.06,
  40.89, 42.56, 44.4, 46.23, 47.55, 49.23, 50.9, 52.9, 54.89, 56.24, 58.24,
  60.23, 62.23, 63.9, 65.74, 67.57, 70.24, 71.56, 73.56, 74.91,
];

// Hard cuts of the reference edit (s). Shot boundaries in SHOTS sit on a cut, onset or (half-)beat.
export const CUTS = [
  8.2, 11.4, 19.3, 28.7, 30.9, 38.6, 43.2, 47.8, 53.8, 57.3, 61.6, 64.2, 69.2,
];

const GRID: number[] = (() => {
  const g: number[] = [];
  for (let n = 0; n <= 2 * 125; n++) g.push(beatFrame(n / 2));
  ONSETS.forEach((s) => g.push(Math.round(s * FPS)));
  CUTS.forEach((s) => g.push(Math.round(s * FPS)));
  return g.sort((a, b) => a - b);
})();

// Snap a reference timestamp (seconds) to the nearest beat, half-beat, onset or cut frame
export const snap = (sec: number) => {
  const f = sec * FPS;
  return GRID.reduce(
    (best, g) => (Math.abs(g - f) < Math.abs(best - f) ? g : best),
    GRID[0],
  );
};

export type ShotId =
  | "S01"
  | "S02"
  | "S03"
  | "S04"
  | "S05"
  | "S06"
  | "S07"
  | "S08"
  | "S09"
  | "S10"
  | "S11"
  | "S12"
  | "S13"
  | "S14"
  | "S15"
  | "S16"
  | "S17"
  | "S18"
  | "S19"
  | "S20"
  | "S21"
  | "S22";

export const SHOTS: Record<ShotId, { from: number; to: number }> = {
  S01: { from: 0, to: 94 },
  S02: { from: 94, to: 246 },
  S03: { from: 246, to: 296 },
  S04: { from: 296, to: 342 },
  S05: { from: 342, to: 387 },
  S06: { from: 387, to: 579 },
  S07: { from: 579, to: 649 },
  S08: { from: 649, to: 720 },
  S09: { from: 720, to: 780 },
  S10: { from: 780, to: 861 },
  S11: { from: 861, to: 927 },
  S12: { from: 927, to: 1158 },
  S13: { from: 1158, to: 1296 },
  S14: { from: 1296, to: 1434 },
  S15: { from: 1434, to: 1614 },
  S16: { from: 1614, to: 1719 },
  S17: { from: 1719, to: 1848 },
  S18: { from: 1848, to: 1926 },
  S19: { from: 1926, to: 2076 },
  S20: { from: 2076, to: 2195 },
  S21: { from: 2195, to: 2295 },
  S22: { from: 2295, to: 2496 },
};

export const shotLength = (id: ShotId) => SHOTS[id].to - SHOTS[id].from;

// Word swaps / pops, as absolute frames snapped to the grid (reference timestamps in seconds)
const C = {
  S01: { welcome: snap(0.45), toThe: snap(1.8), ledger: snap(2.45), whip: 84 },
  S02: {
    art: snap(3.95),
    trades: snap(4.8),
    wallet: snap(5.55),
    solid: snap(6.9),
    whip: snap(7.8),
  },
  S03: { in: 246 },
  S04: { in: 296 },
  S05: { card: 342, word: snap(12.2), push: snap(12.55) },
  S06: { zoom: 387, grid: snap(13.55) },
  S07: { build: 579, text: snap(20.25) },
  S08: { introducing: snap(21.85), the: snap(22.95), ring: snap(23.65) },
  S09: { label: snap(24.4), out: snap(25.68) },
  S10: { wall: 780, yours: snap(27.4) },
  S11: { wipe: 861, card: snap(29.05), label: snap(29.3), click: snap(29.72) },
  S12: {
    grid: 927,
    detail: snap(32.4),
    buy: snap(33.76),
    proof: snap(35.1),
    success: snap(36.9),
  },
  S13: {
    and: 1158,
    keep: snap(39.5),
    collection: snap(40.25),
    spaced: snap(41.6),
    collapse: snap(42.56),
  },
  S14: {
    wipe: 1296,
    sell: snap(43.4),
    with: snap(45.55),
    escrow: snap(45.88),
    backed: snap(46.23),
    trades: snap(46.85),
  },
  S15: {
    inventory: 1434,
    detail: snap(49.23),
    form: snap(50.9),
    typed: snap(51.6),
    offers: snap(52.6),
  },
  S16: { home: snap(54.0), for: snap(55.3), collectors: snap(56.24) },
  S17: { list: 1719, shield: snap(59.3), private: snap(60.7) },
  S18: {
    unlock: 1848,
    memberships: snap(62.05),
    and: snap(62.7),
    rewards: snap(63.07),
  },
  S19: { zoom: 1926, leaderboard: snap(65.4), voucher: snap(67.1) },
  S20: {
    discover: snap(69.3),
    mint: snap(70.24),
    trade: snap(71.36),
    own: snap(72.3),
  },
  S21: { live: snap(73.56), network: snap(74.91), out: snap(76.18) },
  S22: { blob: 2295, icon: snap(77.1), shrink: snap(78.5), url: snap(79.9) },
};

// Cue frame relative to the start of its shot (what a scene's useCurrentFrame() sees)
export const cues = Object.fromEntries(
  Object.entries(C).map(([id, v]) => [
    id,
    Object.fromEntries(
      Object.entries(v).map(([k, f]) => [k, f - SHOTS[id as ShotId].from]),
    ),
  ]),
) as { [K in keyof typeof C]: { [P in keyof (typeof C)[K]]: number } };

export const absoluteCues = C;
