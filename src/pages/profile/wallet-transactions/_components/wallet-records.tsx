import type { SchemaWalletTransactionResponse } from "@/services/api";

import { WalletMobileList } from "./wallet-mobile-list";
import { WalletTable } from "./wallet-table";

export function WalletRecords({
  transactions,
}: {
  transactions: readonly SchemaWalletTransactionResponse[];
}) {
  return (
    <>
      <WalletMobileList transactions={transactions} />
      <WalletTable transactions={transactions} />
    </>
  );
}
