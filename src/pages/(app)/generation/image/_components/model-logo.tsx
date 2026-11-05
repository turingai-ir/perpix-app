import { useState } from "react";
import { Sparkles } from "lucide-react";
import { getModelLogo } from "@/pages/(app)/generation/_utils/model-logo";

export function ImageModelLogo({
  name,
  displayName,
  iconUrl,
}: {
  name: string;
  displayName?: string | null;
  iconUrl?: string | null;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const logo = getModelLogo(name, displayName);
  const source = [logo?.src, iconUrl].find(
    (candidate): candidate is string =>
      !!candidate && !failedSources.includes(candidate),
  );
  const isLocalLogo = source === logo?.src;
  let imageClassName = "size-6 shrink-0 rounded object-contain";
  if (isLocalLogo && logo?.id === "runway") {
    imageClassName += " bg-black p-0.5";
  } else if (
    isLocalLogo &&
    ["xai", "alibaba", "bytedance", "kuaishou"].includes(logo?.id ?? "")
  ) {
    imageClassName += " bg-white p-0.5";
  }

  if (!source)
    return <Sparkles className="size-5 shrink-0" aria-hidden="true" />;

  return (
    <img
      src={source}
      alt=""
      className={imageClassName}
      onError={() =>
        setFailedSources((previous) =>
          previous.includes(source) ? previous : [...previous, source],
        )
      }
    />
  );
}
