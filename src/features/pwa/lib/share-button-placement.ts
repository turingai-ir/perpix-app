export type ShareButtonPlacement = "top" | "bottom";

interface DeviceInfo {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}

const IOS_THIRD_PARTY_BROWSER = /crios|fxios|edgios|opios|gsa/i;

const isIpad = ({ userAgent, platform, maxTouchPoints }: DeviceInfo) =>
  /ipad/i.test(userAgent) ||
  (platform.toLowerCase() === "macintel" && maxTouchPoints > 1);

/**
 * Where the Share button lives in the browser UI:
 * - iPhone Safari: bottom toolbar
 * - iPad (any browser) and iPhone Chrome/Firefox/Edge: top bar
 */
export function getShareButtonPlacement(
  device: DeviceInfo,
): ShareButtonPlacement {
  if (isIpad(device)) return "top";
  if (IOS_THIRD_PARTY_BROWSER.test(device.userAgent)) return "top";
  return "bottom";
}
