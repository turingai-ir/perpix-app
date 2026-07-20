import type { FC } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { useModel } from "@/pages/(app)/generation/_hooks/model";

import { ProviderIndicator } from "./provider-indicator";

type ModelController = ReturnType<typeof useModel>;

export const PromptProviderSelector: FC<{
  disabled?: boolean;
  label: string;
  model: ModelController;
  onProviderChange: (providerUuid: string) => void;
}> = ({ disabled, label, model, onProviderChange }) => {
  const generationConfig = model.generationConfigState.data;
  if (!generationConfig) return null;
  const providers = Array.from(
    { length: generationConfig.available_providers.length },
    (_, providerIndex) => generationConfig.available_providers[providerIndex],
  ).filter((provider) => provider !== undefined);
  if (providers.length === 1) {
    return (
      <ProviderIndicator
        label={label}
        providerName={generationConfig.resolved_provider.name}
      />
    );
  }

  return (
    <Select
      disabled={disabled}
      value={generationConfig.resolved_provider.uuid}
      onValueChange={onProviderChange}
    >
      <SelectTrigger aria-label={label} className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {providers.map((provider) => (
            <SelectItem key={provider.uuid} value={provider.uuid}>
              {provider.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
