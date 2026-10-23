import type { ReactNode } from "react";
import { CreditCard, ShieldCheck, WalletCards } from "lucide-react";

import { cn } from "@/lib/utils";

type FinanceHeroProps = {
  kind: "payments" | "wallet";
  title: string;
  description: string;
  artLabel: string;
  children: ReactNode;
};

export function FinanceHero({
  kind,
  title,
  description,
  artLabel,
  children,
}: FinanceHeroProps) {
  const HeroIcon = kind === "wallet" ? WalletCards : CreditCard;

  return (
    <section
      className={cn("finance-hero", `finance-hero-${kind}`)}
      aria-labelledby={`${kind}-finance-title`}
    >
      <div className="finance-hero-aurora" aria-hidden="true" />
      <div className="finance-hero-copy">
        <span className="finance-hero-mark" aria-hidden="true">
          <HeroIcon />
        </span>
        <h1 id={`${kind}-finance-title`}>{title}</h1>
        <p>{description}</p>
        <div className="finance-hero-actions">{children}</div>
      </div>
      <div className="finance-hero-art" aria-hidden="true">
        <span className="finance-art-card finance-art-card-back" />
        <span className="finance-art-card finance-art-card-front">
          <span className="finance-art-icon">
            <HeroIcon />
          </span>
          <span className="finance-art-copy">{artLabel}</span>
          <span className="finance-art-line finance-art-line-long" />
          <span className="finance-art-line finance-art-line-short" />
          <span className="finance-art-seal">
            <ShieldCheck />
          </span>
        </span>
      </div>
    </section>
  );
}
