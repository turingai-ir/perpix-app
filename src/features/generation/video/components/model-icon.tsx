import { useState } from "react";

import { getModelLogo } from "@/features/generation/model/model-logo";
import { cn } from "@/shared/lib/utils";

export function getModelMark(name: string) {
  const normalizedName = name.toLocaleLowerCase();
  if (normalizedName.includes("wan")) return "W";
  if (normalizedName.includes("grok")) return "x";
  if (normalizedName.includes("seedance")) return "S";
  if (normalizedName.includes("aleph")) return "A";
  if (normalizedName.includes("kling")) return "K";
  return name.trim().charAt(0).toLocaleUpperCase() || "P";
}

const ICON_CLASS = [
  "relative isolate grid size-10.5 flex-none place-items-center overflow-hidden rounded-[10px] border border-foreground/15",
  "bg-[color-mix(in_srgb,var(--primary)_14%,var(--muted))] shadow-[inset_0_1px_rgb(255_255_255/16%),0_8px_18px_rgb(0_0_0/22%)]",
  "after:absolute after:inset-x-[-20%] after:top-[-60%] after:h-[90%] after:-rotate-16 after:bg-linear-to-r after:from-transparent after:via-white/25 after:to-transparent after:content-['']",
  "data-[model-mark=x]:bg-[color-mix(in_srgb,var(--accent-blue)_12%,var(--muted))] data-[model-mark=S]:bg-[color-mix(in_srgb,var(--accent-violet)_21%,var(--muted))] data-[model-mark=A]:bg-[color-mix(in_srgb,var(--accent-orange)_18%,var(--muted))] data-[model-mark=K]:bg-[color-mix(in_srgb,var(--accent-sky)_18%,var(--muted))]",
  "[&_img]:z-1 [&_img]:size-7 [&_img]:object-contain",
  "dark:data-[model-logo=xai]:[&_img]:invert dark:data-[model-logo=alibaba]:[&_img]:invert dark:data-[model-logo=bytedance]:[&_img]:invert dark:data-[model-logo=kuaishou]:[&_img]:invert",
  "data-[model-logo=runway]:[&_img]:w-10",
].join(" ");

export function ModelIcon({
  url,
  name,
  modelId,
  className,
}: {
  url?: string | null;
  name: string;
  modelId?: string;
  className?: string;
}) {
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const localLogo = getModelLogo(modelId ?? name, name);
  const source = [localLogo?.src, url].find(
    (candidate): candidate is string =>
      candidate != null && !failedSources.includes(candidate),
  );

  return (
    <span
      className={cn(ICON_CLASS, className)}
      data-model-logo={source === localLogo?.src ? localLogo?.id : undefined}
      data-model-mark={getModelMark(name)}
    >
      {source ? (
        <img
          src={source}
          alt=""
          width={32}
          height={32}
          onError={() =>
            setFailedSources((previous) =>
              previous.includes(source) ? previous : [...previous, source],
            )
          }
        />
      ) : (
        <span
          className="text-foreground z-1 font-sans text-xl leading-none font-extrabold"
          aria-hidden="true"
        >
          {getModelMark(name)}
        </span>
      )}
    </span>
  );
}
