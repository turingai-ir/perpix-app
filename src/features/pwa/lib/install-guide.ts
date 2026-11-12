import { getShareButtonPlacement } from "./share-button-placement";

export type InstallGuideKind = "ios" | "in-app" | "android";

export interface InstallGuideDevice {
  userAgent: string;
  platform: string;
  maxTouchPoints: number;
}

const IN_APP_BROWSER =
  /instagram|fban|fbav|fb_iab|snapchat|tiktok|musical_ly|bytedance|twitter|linkedinapp|telegram|micromessenger|pinterest|line\/|; wv\)/i;
const IOS_DEVICE = /iphone|ipod|ipad/i;
const ANDROID_WITHOUT_PROMPT = /firefox|samsungbrowser/i;

const isIos = ({ userAgent, platform, maxTouchPoints }: InstallGuideDevice) =>
  IOS_DEVICE.test(userAgent) ||
  (platform.toLowerCase() === "macintel" && maxTouchPoints > 1);

const isAndroid = ({ userAgent }: InstallGuideDevice) =>
  /android/i.test(userAgent);

/**
 * Which manual install guide a device needs when the browser cannot show a
 * native install prompt. Returns null when no guide applies.
 */
export function detectInstallGuide(
  device: InstallGuideDevice,
): InstallGuideKind | null {
  const ios = isIos(device);
  if (!ios && !isAndroid(device)) return null;

  // iOS web views omit the "Safari" token that real browsers keep.
  const isIosWebView = ios && !/safari/i.test(device.userAgent);
  if (IN_APP_BROWSER.test(device.userAgent) || isIosWebView) return "in-app";

  if (ios) return "ios";
  if (ANDROID_WITHOUT_PROMPT.test(device.userAgent)) return "android";
  return null;
}

export const getGuideHintPlacement = (
  kind: InstallGuideKind,
  device: InstallGuideDevice,
) => (kind === "ios" ? getShareButtonPlacement(device) : null);
