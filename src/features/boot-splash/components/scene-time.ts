/**
 * Shared, time-warped scene time. Every animated part reads `sceneClock.time`
 * so the slow-motion around each clash stays perfectly in sync.
 */
export const sceneClock = { time: 0 };
