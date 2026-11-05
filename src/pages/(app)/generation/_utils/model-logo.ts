type ModelLogo = { id: string; src: string };

const modelLogos: ReadonlyArray<readonly [RegExp, ModelLogo]> = [
  [
    /\b(?:gpt image|openai|sora|dall e|dalle)\b/,
    { id: "openai", src: "/images/model-logos/openai.png" },
  ],
  [
    /\b(?:google|nano banana|imagen|veo)\b/,
    { id: "google", src: "/images/model-logos/google.png" },
  ],
  [
    /\b(?:black forest labs|flux)\b/,
    { id: "bfl", src: "/images/model-logos/bfl.svg" },
  ],
  [/\bideogram\b/, { id: "ideogram", src: "/images/model-logos/ideogram.ico" }],
  [/\brecraft\b/, { id: "recraft", src: "/images/model-logos/recraft.png" }],
  [
    /\b(?:seedream|seedance|bytedance)\b/,
    { id: "bytedance", src: "/images/model-logos/bytedance.svg" },
  ],
  [/\b(?:grok|xai)\b/, { id: "xai", src: "/images/model-logos/xai.svg" }],
  [
    /\b(?:wan|z image|alibaba)\b/,
    { id: "alibaba", src: "/images/model-logos/alibaba-cloud.svg" },
  ],
  [
    /\b(?:kling|kuaishou)\b/,
    { id: "kuaishou", src: "/images/model-logos/kuaishou.svg" },
  ],
  [
    /\b(?:aleph|runway)\b/,
    { id: "runway", src: "/images/model-logos/runway.svg" },
  ],
];

export function getModelLogo(name: string, displayName?: string | null) {
  const normalizedName = `${name} ${displayName ?? ""}`
    .replace(/[_-]+/g, " ")
    .toLowerCase();

  return modelLogos.find(([pattern]) => pattern.test(normalizedName))?.[1];
}
