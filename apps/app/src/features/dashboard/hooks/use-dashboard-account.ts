import { useActiveSubscription } from "@/features/pricing";
import { useUser } from "@/features/user";
import { useWallet, useWalletTransactions } from "@/features/wallet";
import type {
  SchemaGetWalletResponse,
  SchemaGetWalletTransactionsResponse,
  SchemaUserGetInfoResponse,
  SchemaUserSubscriptionResponse,
} from "@/shared/api";

export function useDashboardAccount() {
  const userState = useUser();
  const walletState = useWallet();
  const subscriptionState = useActiveSubscription();
  const transactionsState = useWalletTransactions({ limit: 3 });

  return {
    subscription: subscriptionState.data as unknown as
      | SchemaUserSubscriptionResponse
      | undefined,
    subscriptionState,
    transactions: (
      transactionsState.data as unknown as
        | SchemaGetWalletTransactionsResponse
        | undefined
    )?.transactions,
    transactionsState,
    user: userState.data as unknown as SchemaUserGetInfoResponse | undefined,
    userState,
    wallet: walletState.data as unknown as SchemaGetWalletResponse | undefined,
    walletState,
  };
}
