import { useCallback } from "react";
import { atom, useAtom } from "jotai";

/** Why the charge dialog was opened, so it can explain the next step. */
export type WalletChargeReason = "insufficientBalance";

type WalletChargeDialogState = {
  open: boolean;
  reason?: WalletChargeReason;
};

const walletChargeDialogAtom = atom<WalletChargeDialogState>({ open: false });

export function useWalletChargeDialog() {
  const [state, setState] = useAtom(walletChargeDialogAtom);

  const openWalletCharge = useCallback(
    (reason?: WalletChargeReason) => setState({ open: true, reason }),
    [setState],
  );
  const setWalletChargeOpen = useCallback(
    (open: boolean) =>
      setState((current) => (open ? { ...current, open } : { open: false })),
    [setState],
  );

  return {
    isWalletChargeOpen: state.open,
    openWalletCharge,
    setWalletChargeOpen,
    walletChargeReason: state.reason,
  };
}
