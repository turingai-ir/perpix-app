import type { FC } from "react";
import { cn } from "@/shared/lib/utils";
import {
  FINANCE_PAGE_CLASS,
  FINANCE_PAGE_WALLET_CLASS,
} from "@/shared/components/finance";
import { WalletHero } from "./wallet-hero";
import { WalletSummary } from "./wallet-summary";
import { WalletArchive } from "./wallet-archive";
import { useWalletTransactionsPage } from "../../hooks/use-wallet-transactions-page";

export const WalletTransactionsPage: FC = () => {
  const pageState = useWalletTransactionsPage();
  const { transactions } = pageState;

  return (
    <div
      className={cn(FINANCE_PAGE_CLASS, FINANCE_PAGE_WALLET_CLASS)}
      data-finance-page="wallet"
    >
      <WalletHero />
      <WalletSummary transactions={transactions} />
      <WalletArchive {...pageState} />
    </div>
  );
};

export default WalletTransactionsPage;
