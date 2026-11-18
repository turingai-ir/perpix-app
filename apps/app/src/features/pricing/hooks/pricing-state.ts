import { atom } from "jotai";

import type { PricingFeatureState } from "../model/types";

export const initialPricingFeatureState: PricingFeatureState = {
  open: false,
  requiredModelNames: [],
  requiredScopes: [],
};

export const pricingFeatureAtom = atom<PricingFeatureState>(
  initialPricingFeatureState,
);
