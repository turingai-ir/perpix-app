export type FighterSide = "left" | "right";

export interface FighterPose {
  x: number;
  y: number;
  /** Lean around the depth axis, radians. */
  lean: number;
  /** Turn around the vertical axis, radians. */
  turn: number;
}

export const ROUND_SECONDS = 2.6;
export const CLASH_AT = 1.42;
const STANCE_X = 1.75;
const STRIKE_X = 0.62;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => value * value * (3 - 2 * value);
const span = (u: number, from: number, to: number) =>
  clamp01((u - from) / (to - from));

/** Seconds since the most recent clash (wraps around the round). */
export function clashAge(time: number): number {
  const u = time % ROUND_SECONDS;
  return u >= CLASH_AT ? u - CLASH_AT : u + ROUND_SECONDS - CLASH_AT;
}

/**
 * Pose of one fighter at `time`: circle → wind up → lunge → clash → recoil.
 * Odd rounds the right fighter attacks with a jumping strike.
 */
export function fighterPose(time: number, side: FighterSide): FighterPose {
  const s = side === "left" ? -1 : 1;
  const u = time % ROUND_SECONDS;
  const jumper = side === "right" && Math.floor(time / ROUND_SECONDS) % 2 === 1;

  const windUp = smooth(span(u, 1.0, 1.25));
  const lunge = span(u, 1.25, CLASH_AT) ** 3;
  const recoil = span(u, CLASH_AT, 1.9);
  const settle = smooth(span(u, 1.9, ROUND_SECONDS));

  const idleSway = Math.sin(time * 4 + (s > 0 ? 1.3 : 0)) * 0.06;
  const stance = s * (STANCE_X + idleSway);
  const pulledBack = stance + s * 0.25 * windUp;
  const struck = pulledBack + (s * STRIKE_X - pulledBack) * lunge;
  // Damped spring back from the impact, overshooting slightly.
  const spring = 1 - Math.exp(-recoil * 6) * Math.cos(recoil * 9);
  const recoiled = s * STRIKE_X + (stance + s * 0.15 - s * STRIKE_X) * spring;

  let x = struck;
  if (u >= CLASH_AT) x = recoiled + (stance - recoiled) * settle;

  const bob = Math.abs(Math.sin(time * 6 + s)) * 0.06;
  const hop = jumper ? Math.sin(Math.PI * span(u, 1.0, CLASH_AT)) * 0.7 : 0;
  const lean =
    -s * 0.18 * windUp * (1 - lunge) +
    s * 0.28 * lunge * (1 - recoil) +
    Math.sin(time * 3 + s) * 0.04;
  const turn = jumper ? Math.PI * 2 * smooth(span(u, 1.05, CLASH_AT)) : 0;

  return { x, y: bob + hop, lean, turn };
}
