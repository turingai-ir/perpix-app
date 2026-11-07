export type VisualQuality = "full" | "lite";

type StoredQuality = {
  tier: VisualQuality;
  source: "auto" | "forced";
  at: number;
};

type NavigatorHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

export const VISUAL_QUALITY_STORAGE_KEY = "perpix:visual-quality";
const QUERY_PARAM = "fx";
// Re-check automatic decisions weekly: hardware, browser and displays change.
const AUTO_DECISION_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SOFTWARE_RENDERER = /swiftshader|llvmpipe|software|basic render/i;

const isQuality = (value: unknown): value is VisualQuality =>
  value === "full" || value === "lite";

function readStored(): StoredQuality | undefined {
  try {
    const raw = localStorage.getItem(VISUAL_QUALITY_STORAGE_KEY);
    const parsed: Partial<StoredQuality> | null = raw ? JSON.parse(raw) : null;
    if (!parsed || !isQuality(parsed.tier) || typeof parsed.at !== "number") {
      return undefined;
    }
    return {
      tier: parsed.tier,
      source: parsed.source === "forced" ? "forced" : "auto",
      at: parsed.at,
    };
  } catch {
    return undefined;
  }
}

export function storeVisualQuality(value: StoredQuality | null) {
  try {
    if (value) {
      localStorage.setItem(VISUAL_QUALITY_STORAGE_KEY, JSON.stringify(value));
    } else {
      localStorage.removeItem(VISUAL_QUALITY_STORAGE_KEY);
    }
  } catch {
    // Storage can be unavailable (private mode); the tier still applies.
  }
}

function usesSoftwareRenderer(): boolean {
  try {
    const gl = document.createElement("canvas").getContext("webgl");
    // No WebGL usually means the browser disabled GPU acceleration.
    if (!gl) return true;
    const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
    const renderer = String(
      gl.getParameter(
        debugInfo ? debugInfo.UNMASKED_RENDERER_WEBGL : gl.RENDERER,
      ),
    );
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return SOFTWARE_RENDERER.test(renderer);
  } catch {
    return false;
  }
}

export function detectHardwareQuality(
  nav: NavigatorHints = navigator,
): VisualQuality {
  if (nav.connection?.saveData) return "lite";
  if (nav.deviceMemory !== undefined && nav.deviceMemory < 4) return "lite";
  if (nav.hardwareConcurrency > 0 && nav.hardwareConcurrency < 4) return "lite";
  return usesSoftwareRenderer() ? "lite" : "full";
}

/** `?fx=lite|full` pins a tier for QA; `?fx=auto` returns to detection. */
function applyQueryOverride(now: number) {
  const value = new URLSearchParams(window.location.search).get(QUERY_PARAM);
  if (value === "auto") storeVisualQuality(null);
  if (isQuality(value))
    storeVisualQuality({ tier: value, source: "forced", at: now });
}

export function resolveVisualQuality(now = Date.now()) {
  applyQueryOverride(now);
  const stored = readStored();
  const isFresh = stored && now - stored.at < AUTO_DECISION_TTL_MS;
  if (stored && (stored.source === "forced" || isFresh)) {
    return { tier: stored.tier, isForced: stored.source === "forced" };
  }
  const tier = detectHardwareQuality();
  storeVisualQuality({ tier, source: "auto", at: now });
  return { tier, isForced: false };
}

export function applyVisualQuality(tier: VisualQuality) {
  document.documentElement.dataset.fx = tier;
}
