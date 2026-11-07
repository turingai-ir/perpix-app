import { useCallback } from "react";
import { useSetAtom } from "jotai";

import { initialPricingFeatureState, pricingFeatureAtom } from "./pricing-state";
import type { OpenPricingFeatureOptions, PricingFeatureApi } from "../model/types";

export function usePricingFeature(): PricingFeatureApi {
  const setPricingFeature = useSetAtom(pricingFeatureAtom);

  const openPricingFeature = useCallback(
    (options?: OpenPricingFeatureOptions) => {
      setPricingFeature({
        open: true,
        requiredModelNames: options?.requiredModelNames ?? [],
        requiredScopes: options?.requiredScopes ?? [],
      });
    },
    [setPricingFeature],
  );

  const closePricingFeature = useCallback(() => {
    setPricingFeature(initialPricingFeatureState);
  }, [setPricingFeature]);

  return {
    openPricingFeature,
    closePricingFeature,
  };
}
