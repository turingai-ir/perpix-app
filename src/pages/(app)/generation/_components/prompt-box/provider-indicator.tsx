import type { FC } from "react";

export const ProviderIndicator: FC<{
  label: string;
  providerName?: string;
}> = ({ label, providerName }) => {
  if (!providerName) return null;

  return (
    <output aria-label={label} className="text-muted-foreground text-sm">
      {providerName}
    </output>
  );
};
