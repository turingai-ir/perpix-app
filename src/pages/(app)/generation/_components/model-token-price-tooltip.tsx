import { useMemo, type FC } from "react";
import { DollarSign } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAppTranslate } from "@/hooks";
import {
  getTierPriceUsdmicroRange,
  normalizePricingTiers,
} from "@/pages/(app)/generation/_utils/model-pricing";
import { formatTokenAmount } from "@/utils";

export const ModelTokenPriceTooltip: FC<{
  isLoading?: boolean;
  pricingTiers?: unknown;
}> = ({ isLoading, pricingTiers }) => {
  const { t } = useAppTranslate();
  const normalizedPricingTiers = useMemo(
    () => normalizePricingTiers(pricingTiers),
    [pricingTiers],
  );
  const priceRange = useMemo(
    () => getTierPriceUsdmicroRange(normalizedPricingTiers),
    [normalizedPricingTiers],
  );

  const tooltipText = useMemo(() => {
    if (isLoading) {
      return t("pages.generation.modelTokenPrice.loading");
    }

    if (!priceRange) {
      return t("pages.generation.modelTokenPrice.empty");
    }

    return t("pages.generation.modelTokenPrice.range", {
      max: formatTokenAmount(priceRange.max),
      min: formatTokenAmount(priceRange.min),
    });
  }, [isLoading, t, priceRange]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={t("pages.generation.modelTokenPrice.ariaLabel")}
        >
          <DollarSign className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-fit max-w-64 px-3 py-1.5 text-center text-xs leading-6"
      >
        {tooltipText}
      </PopoverContent>
    </Popover>
  );
};
