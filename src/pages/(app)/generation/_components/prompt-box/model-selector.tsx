import type { FC } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { useModel } from "@/pages/(app)/generation/_hooks/model";

import { ModelSelectItem } from "../model-select-item";

type ModelController = ReturnType<typeof useModel>;

export const PromptModelSelector: FC<{
  chooseModelLabel: string;
  disabled?: boolean;
  model: ModelController;
  upgradeLabel: string;
}> = ({ chooseModelLabel, disabled, model, upgradeLabel }) => (
  <Select
    value={model.currentModel ?? ""}
    onValueChange={model.setCurrentModel}
    disabled={disabled}
  >
    <SelectTrigger className="w-full">
      <SelectValue placeholder={chooseModelLabel} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectLabel>{chooseModelLabel}</SelectLabel>
        {model.modelsListState.isSuccess &&
          model.modelsListState.data.map((item) => (
            <ModelSelectItem
              key={item.uuid}
              allowedModelNames={model.allowedModelNames}
              model={item}
              upgradeLabel={upgradeLabel}
            />
          ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);
