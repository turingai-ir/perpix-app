export interface OpenPricingFeatureOptions {
  requiredModelNames?: string[];
  requiredScopes?: string[];
}

export interface PricingFeatureApi {
  openPricingFeature: (options?: OpenPricingFeatureOptions) => void;
  closePricingFeature: () => void;
}

export interface PricingFeatureState {
  requiredModelNames: string[];
  open: boolean;
  requiredScopes: string[];
}
