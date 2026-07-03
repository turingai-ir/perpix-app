import { Lock } from "lucide-react";

import { SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { SchemaAiRegistryModelSummary } from "@/services/api";
import { isModelAllowed } from "@/pages/(app)/generation/_utils/model-access";

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
          <span className="ms-auto inline-flex shrink-0 items-center gap-1 rounded-sm bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-700 dark:text-amber-300">
            <Lock className="size-3" />
            {upgradeLabel}
          </span>
        )}
      </span>
    </SelectItem>
  );
};
