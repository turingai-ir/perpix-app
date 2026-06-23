import type { FC } from "react";

import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  label: string;
}

export const GenerationMediaPlaceholder: FC<Props> = ({ label }) => (
  <div className="flex w-full flex-col gap-2">
    <p className="text-muted-foreground text-sm">{label}</p>
    <div className="aspect-square w-full overflow-hidden rounded-lg border">
      <Skeleton className="h-full w-full animate-pulse overflow-hidden rounded-lg" />
    </div>
  </div>
);
