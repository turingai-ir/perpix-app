import { useState } from "react";
import { ArrowDownLeft, ArrowUpRight, RotateCcw, Orbit } from "lucide-react";
import { useSearchParams } from "react-router";
import { useWalletTransactions } from "@/feature/wallet";
import { useAppTranslate } from "@/hooks";
import type { SchemaWalletTransactionResponse } from "@/services/api";
import { FinanceHero } from "../_components/finance-hero";
import { FinanceToolbar } from "../_components/finance-toolbar";
import { FinanceFeedback } from "../_components/finance-feedback";
import { PaginationFooter } from "../_components/pagination-footer";
import { financeNumber, financeOffset } from "../_components/finance-format";
import { WalletRecord } from "./wallet-record";
import { WalletBalance } from "./wallet-balance";
import "../finance.css";

const PAGE_LIMIT = 20;
const filters = ["all", "DEPOSIT", "WITHDRAW", "REFUND"] as const;

export default function ProfileWalletTransactionsPage() {
  const { t, i18n } = useAppTranslate();
  const [params, setParams] = useSearchParams();
  const offset = financeOffset(params.get("offset"));
  const query = useWalletTransactions({ offset, limit: PAGE_LIMIT });
  const [selected, setSelected] = useState("all");
  const [search, setSearch] = useState("");
  // The API wrapper maps readonly arrays as objects; normalize at this boundary.
  const transactions = Array.from(
    (query.data?.transactions ??
      []) as ArrayLike<SchemaWalletTransactionResponse>,
  );
  const visible = transactions.filter(
    (item) =>
      (selected === "all" || item.type === selected) &&
      item.transaction_uuid.toLowerCase().includes(search.trim().toLowerCase()),
  );
  const metrics = [
    {
      label: "depositTotal",
      type: "DEPOSIT",
      icon: ArrowDownLeft,
      tone: "positive",
    },
    {
      label: "withdrawTotal",
      type: "WITHDRAW",
      icon: ArrowUpRight,
      tone: "pending",
    },
    { label: "refundTotal", type: "REFUND", icon: RotateCcw, tone: "neutral" },
  ] as const;
  const clear = () => {
    setSelected("all");
    setSearch("");
  };
  function goToOffset(next: number) {
    clear();
    setParams((previous) => {
      const updated = new URLSearchParams(previous);
      updated.set("offset", String(Math.max(0, next)));
      return updated;
    });
  }
  return (
    <div className="finance-page finance-page--wallet">
      <FinanceHero variant="wallet">
        <WalletBalance />
      </FinanceHero>
      <div className="finance-section-heading">
        <span className="finance-eyebrow">
          <Orbit size={16} aria-hidden="true" />
          {t("pages.profile.finance.walletArchive")}
        </span>
        <p>{t("pages.profile.finance.pageScope")}</p>
      </div>
      <dl className="finance-metrics">
        {metrics.map(({ label, type, icon: Icon, tone }) => (
          <div key={label} className={`finance-metric finance-metric--${tone}`}>
            <Icon size={20} aria-hidden="true" />
            <div>
              <dt>{t(`pages.profile.finance.${label}`)}</dt>
              <dd>
                {query.data
                  ? financeNumber(
                      transactions
                        .filter((item) => item.type === type)
                        .reduce(
                          (total, item) =>
                            total + Math.abs(item.amount_usdmicro),
                          0,
                        ),
                      i18n.language,
                      true,
                    )
                  : "—"}
                <small>{t("pages.profile.finance.token")}</small>
              </dd>
            </div>
          </div>
        ))}
      </dl>
      <section
        className="finance-ledger"
        aria-label={t("pages.profile.finance.walletArchive")}
      >
        <FinanceToolbar
          options={filters}
          selected={selected}
          search={search}
          onSelect={setSelected}
          onSearch={setSearch}
          onRefresh={() => query.refetch()}
          fetching={query.isFetching}
        />
        <FinanceFeedback
          loading={query.isPending}
          error={query.isError}
          paused={query.fetchStatus === "paused"}
          hasData={!!query.data}
          empty={query.isSuccess && transactions.length === 0}
          noResults={query.isSuccess && visible.length === 0}
          variant="wallet"
          onRetry={() => query.refetch()}
          onClear={clear}
        />
        {transactions.length > 0 && (
          <p className="finance-result-count" role="status">
            {t("pages.profile.finance.resultCount", {
              value: financeNumber(visible.length, i18n.language),
            })}
          </p>
        )}
        <div className="finance-records" aria-busy={query.isFetching}>
          {visible.map((transaction) => (
            <WalletRecord
              key={transaction.transaction_uuid}
              transaction={transaction}
            />
          ))}
        </div>
        <PaginationFooter
          offset={offset}
          count={transactions.length}
          hasNext={query.data?.has_next ?? false}
          isFetching={query.isFetching}
          onPrevious={() => goToOffset(offset - PAGE_LIMIT)}
          onNext={() => goToOffset(offset + PAGE_LIMIT)}
        />
      </section>
    </div>
  );
}
