import { cn } from "@/lib/utils";

import type { FieldLayout } from "../../types";

export function getFieldLayoutClasses(layout: FieldLayout) {
  const isStacked = layout === "stacked";

  return {
    control: isStacked ? "w-full" : "w-full md:min-w-32",
    input: isStacked ? "w-full" : "w-full md:w-32",
    hint: cn(
      "text-muted-foreground/60 text-[0.7rem] leading-snug",
      !isStacked && "md:basis-full",
    ),
    isStacked,
    item: cn(
      "space-y-1",
      isStacked
        ? "flex w-full flex-col items-stretch"
        : "flex w-full flex-col items-stretch md:w-auto md:flex-row md:flex-wrap md:items-center",
    ),
    label: cn(
      "text-sm font-normal whitespace-nowrap",
      isStacked && "text-muted-foreground",
    ),
  };
}

export type FieldLayoutClasses = ReturnType<typeof getFieldLayoutClasses>;
