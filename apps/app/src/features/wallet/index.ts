import { lazy } from "react";

export * from "./hooks/wallet-queries";
export * from "./hooks/use-wallet-charge-dialog";
export * from "./hooks/use-wallet-transactions-page";
export const WalletChargeFlow = lazy(() =>
  import("./components/wallet-charge-flow").then((m) => ({
    default: m.WalletChargeFlow,
  })),
);
export { WalletNextStep } from "./components/wallet-next-step";
