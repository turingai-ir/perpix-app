/**
 * Physical haptic feedback for mobile touch devices.
 * Uses Navigator.vibrate with subtle, calibrated millisecond bursts.
 * Silently no-ops on desktop or when unsupported.
 */
export type HapticFeedbackType = "selection" | "light" | "medium" | "heavy";

export function triggerHaptic(type: HapticFeedbackType = "light") {
  if (typeof window === "undefined" || !("vibrate" in navigator)) return;
  try {
    switch (type) {
      case "selection":
        // Ultra-short 8ms tick for tab changes, segmented controls and toggles
        navigator.vibrate(8);
        break;
      case "light":
        // 12ms soft tap for buttons and chips
        navigator.vibrate(12);
        break;
      case "medium":
        // 20ms affirmative tap for primary actions and dialog confirmations
        navigator.vibrate(20);
        break;
      case "heavy":
        // 35ms solid pulse for destructive confirmations or errors
        navigator.vibrate(35);
        break;
    }
  } catch {
    // Vibration may be blocked by system settings or low-power mode; ignore.
  }
}
