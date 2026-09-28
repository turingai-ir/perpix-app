import type { ReactNode } from "react";
import { ArrowUpLeft, Fingerprint } from "lucide-react";
import { Link } from "react-router";

import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router";
import { FinanceArt } from "./finance-art";

export function FinanceHero({
  variant,
  children,
}: {
  variant: "payments" | "wallet";
  children?: ReactNode;
}) {
  const { t } = useAppTranslate();
  const payments = variant === "payments";
  return (
    <section className="finance-hero">
      <div className="finance-hero-copy">
        <span className="finance-eyebrow">
          <Fingerprint size={16} aria-hidden="true" />
          {t("pages.profile.finance.eyebrow")}
        </span>
        <h1>
          {t(
            payments
              ? "pages.profile.finance.paymentsTitle"
              : "pages.profile.finance.walletTitle",
          )}
        </h1>
        <p className="finance-hero-description">
          {t(
            payments
              ? "pages.profile.finance.paymentsDescription"
              : "pages.profile.finance.walletDescription",
          )}
        </p>
        {children}
        <Link
          className="finance-crosslink"
          to={
            payments
              ? APP_ROUTES_KEY.profile.walletTransactions.path
              : APP_ROUTES_KEY.profile.payments.path
          }
        >
          {t(
            payments
              ? "pages.profile.finance.walletLink"
              : "pages.profile.finance.paymentsLink",
          )}
          <ArrowUpLeft size={17} aria-hidden="true" />
        </Link>
      </div>
      <FinanceArt variant={variant} />
    </section>
  );
}
