const WINDOW_FRAMES = 90;
// Very slow devices fill a frame window too late; close it by time instead.
const WINDOW_MS = 1500;
const MIN_WINDOW_FRAMES = 12;
const REQUIRED_JANKY_WINDOWS = 2;
const JANKY_WINDOW_RATIO = 0.25;
const SLOW_FRAME_FACTOR = 1.6;
const SCROLL_IDLE_MS = 160;
// Longer gaps are pauses (debugger, suspended page), not rendering cost.
// Hidden tabs are excluded separately through visibilitychange.
const MAX_FRAME_GAP_MS = 1000;
// Every display refreshes at least at 60 Hz. Idle frames cannot calibrate
// this: on weak GPUs the always-on glows make idle frames slow as well.
const SIXTY_HZ_MS = 1000 / 60;

const percentile = (values: number[], ratio: number) =>
  [...values].sort((a, b) => a - b)[Math.floor(values.length * ratio)];

/**
 * Samples frame pacing only while the user scrolls `target`. When two consecutive
 * windows drop too many frames, `onJank` runs once after scrolling settles,
 * so a tier switch never happens mid-gesture.
 */
export function watchScrollSmoothness(
  target: HTMLElement,
  onJank: () => void,
): () => void {
  let frame = 0;
  let lastTime = 0;
  let idleTimer = 0;
  let jankyWindows = 0;
  let isJanky = false;
  // Only shrinks, so 120/144 Hz displays are judged by their own cadence.
  let refreshInterval = SIXTY_HZ_MS;
  let deltas: number[] = [];
  let windowDuration = 0;
  let lastDelta = 0;

  const evaluateWindow = () => {
    refreshInterval = Math.min(refreshInterval, percentile(deltas, 0.1));
    const slowLimit = Math.max(refreshInterval, 4) * SLOW_FRAME_FACTOR;
    const slowFrames = deltas.filter((delta) => delta > slowLimit).length;
    const ratio = slowFrames / deltas.length;
    deltas = [];
    windowDuration = 0;
    jankyWindows = ratio > JANKY_WINDOW_RATIO ? jankyWindows + 1 : 0;
    isJanky = jankyWindows >= REQUIRED_JANKY_WINDOWS;
  };

  const tick = (time: number) => {
    const delta = time - lastTime;
    if (lastTime && delta < MAX_FRAME_GAP_MS) {
      deltas.push(delta);
      windowDuration += delta;
      lastDelta = delta;
    }
    lastTime = time;
    const isTimedOut =
      windowDuration >= WINDOW_MS && deltas.length >= MIN_WINDOW_FRAMES;
    if (deltas.length >= WINDOW_FRAMES || isTimedOut) evaluateWindow();
    frame = requestAnimationFrame(tick);
  };

  const stopSampling = () => {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    lastDelta = 0;
  };

  const settle = () => {
    stopSampling();
    if (!isJanky) return;
    dispose();
    onJank();
  };

  const onScroll = () => {
    if (document.hidden) return;
    if (!frame) frame = requestAnimationFrame(tick);
    window.clearTimeout(idleTimer);
    // Slow frames space scroll events out; never mistake that for a pause.
    idleTimer = window.setTimeout(
      settle,
      Math.max(SCROLL_IDLE_MS, lastDelta * 3),
    );
  };

  const onVisibilityChange = () => {
    if (!document.hidden) return;
    stopSampling();
    deltas = [];
    windowDuration = 0;
  };

  target.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("visibilitychange", onVisibilityChange);

  function dispose() {
    stopSampling();
    window.clearTimeout(idleTimer);
    target.removeEventListener("scroll", onScroll);
    document.removeEventListener("visibilitychange", onVisibilityChange);
  }

  return dispose;
}
