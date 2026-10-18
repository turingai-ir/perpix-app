import { lazy } from "react";

export * from "./api";
export * from "./hook";
export * from "./state";
export * from "./types";

export const PricingFeature = lazy(() => import("./pricing"));
