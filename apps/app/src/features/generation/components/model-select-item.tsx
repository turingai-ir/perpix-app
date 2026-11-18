import { Lock } from "lucide-react";

import { SelectItem } from "@/shared/ui/select";
import { cn } from "@/shared/lib/utils";
import type { SchemaAiRegistryModelSummary } from "@/shared/api";
import { isModelAllowed } from "@/features/generation/model/model-access";

interface ModelSelectItemProps {
  model: SchemaAiRegistryModelSummary;
  allowedModelNames?: readonly string[] | null;
  upgradeLabel: string;
}

export const ModelSelectItem = ({
  model,
  allowedModelNames,
  upgradeLabel,
}: ModelSelectItemProps) => {
  const isAllowed = isModelAllowed(model, allowedModelNames);

  return (
    <SelectItem
      key={model.uuid}
      value={model.uuid}
      className={cn(!isAllowed && "opacity-70")}
    >
      <span className="flex min-w-0 items-center gap-2">
        <span className="truncate">{model.display_name ?? model.name}</span>
        {!isAllowed && (
          <span className="bg-warning/10 text-caption text-warning ms-auto inline-flex shrink-0 items-center gap-1 rounded-sm px-1.5 py-0.5">
            <Lock className="size-3" />
            {upgradeLabel}
          </span>
        )}
      </span>
    </SelectItem>
  );
};
