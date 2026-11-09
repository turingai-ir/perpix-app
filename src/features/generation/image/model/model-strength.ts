const STRENGTH_PATTERNS: Array<[RegExp, string]> = [
  [/image auto/, "imageAuto"],
  [/soul cinema.*1[ .]?5/, "soulCinema15"],
  [/soul cinema/, "soulCinema"],
  [/soul.*2(?:[ .]?0)?/, "soul2"],
  [/\bsoul\b/, "soul"],
  [/gpt image.*sunburst/, "gptSunburst"],
  [/gpt image.*flare/, "gptFlare"],
  [/gpt image/, "gptImage"],
  [/nano banana.*2.*lite|nano banana.*lite/, "nanoLite"],
  [/nano banana.*flash/, "nanoFlash"],
  [/nano banana.*pro/, "nanoPro"],
  [/nano banana.*2/, "nano2"],
  [/nano banana/, "nano"],
  [/flux.*kontext/, "fluxKontext"],
  [/flux.*2.*max/, "fluxMax"],
  [/flux.*2.*flex/, "fluxFlex"],
  [/flux.*2|flux.*pro/, "flux"],
  [/seedream.*5.*pro/, "seedreamPro"],
  [/seedream.*5.*lite/, "seedreamLite"],
  [/seedream/, "seedream"],
  [/recraft.*util/, "recraftUtility"],
  [/recraft.*style/, "recraftStyles"],
  [/recraft/, "recraft"],
  [/character swap/, "characterSwap"],
  [/face swap/, "faceSwap"],
  [/kling.*o1/, "kling"],
  [/grok.*2(?:[ .]?0)?/, "grok2"],
  [/grok/, "grok"],
  [/wan.*2[ .]?2/, "wan"],
  [/z[- ]?image/, "zImage"],
  [/hazel/, "hazel"],
];

export function getModelStrength(
  description?: string | null,
  name?: string | null,
  displayName?: string | null,
): string {
  const source = `${name ?? ""} ${displayName ?? ""} ${description ?? ""}`
    .replace(/_/g, " ")
    .toLowerCase();

  const match = STRENGTH_PATTERNS.find(([pattern]) => pattern.test(source));
  if (match) return match[1];
  if (/edit|inpaint|replace|retouch|transform/.test(source)) return "edit";
  if (/typograph|text render|logo|poster/.test(source)) return "text";
  if (/photo|realistic|portrait|cinematic/.test(source)) return "photo";
  if (/illustrat|artistic|anime|design/.test(source)) return "art";
  if (/fast|turbo|lite|speed|schnell/.test(source)) return "fast";
  return "general";
}
