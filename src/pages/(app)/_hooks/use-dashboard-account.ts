import { useActiveSubscription } from "@/feature/pricing";
import { useUser } from "@/feature/user";
import { useWallet, useWalletTransactions } from "@/feature/wallet";
import type {
  SchemaGetWalletResponse,
  SchemaGetWalletTransactionsResponse,
  SchemaUserGetInfoResponse,
  SchemaUserSubscriptionResponse,
} from "@/services/api";

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
