import type { ReactNode } from "react";
import { CreditCard, ShieldCheck, WalletCards } from "lucide-react";

import { cn } from "@/shared/lib/utils";

const HERO_BG = {
  payments:
    "bg-[radial-gradient(circle_at_20%_8%,rgb(126_86_219/42%),transparent_36%),linear-gradient(125deg,oklch(0.18_0.08_285),oklch(0.24_0.1_300)_50%,oklch(0.3_0.1_315))]",
  wallet:
    "bg-[radial-gradient(circle_at_16%_12%,rgb(57_191_176/34%),transparent_38%),linear-gradient(125deg,oklch(0.22_0.04_215),oklch(0.28_0.05_220)_50%,oklch(0.34_0.06_210))]",
} as const;

const AURORA = {
  payments: "bg-[radial-gradient(circle,rgb(209_123_255/30%),transparent_68%)]",
  wallet: "bg-[radial-gradient(circle,rgb(102_231_218/26%),transparent_68%)]",
} as const;

const ART_CARD_CLASS =
  "absolute block aspect-[1.58] w-50 rounded-[1.1rem] border border-white/22 bg-linear-145 from-white/18 to-white/6 shadow-[0_24px_50px_-25px_rgb(0_0_0/65%),inset_0_1px_rgb(255_255_255/18%)] backdrop-blur-2xl backdrop-saturate-125 sm:w-[min(26vw,20rem)] sm:rounded-[1.4rem]";

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
      className={cn(
        "animate-finance-rise relative grid min-h-96 overflow-hidden rounded-[1.75rem] text-white shadow-[0_30px_80px_-48px_rgb(31_14_65/90%)] after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:border after:border-white/14 after:content-[''] motion-reduce:animate-none sm:min-h-80",
        HERO_BG[kind],
      )}
      aria-labelledby={`${kind}-finance-title`}
    >
      <div
        className={cn(
          "-left-auto pointer-events-none absolute -right-0 -bottom-60 size-128 rounded-full blur-[12px]",
          AURORA[kind],
        )}
        aria-hidden="true"
      />
      <div className="relative z-2 flex max-w-180 flex-col justify-end p-8 pt-34 sm:justify-center sm:p-11">
        <span
          className="mb-5.5 grid size-13 place-items-center rounded-2xl border border-white/20 bg-white/11 shadow-[inset_0_1px_rgb(255_255_255/16%)] backdrop-blur-lg [&_svg]:size-5.5"
          aria-hidden="true"
        >
          <HeroIcon />
        </span>
        <h1
          id={`${kind}-finance-title`}
          className="max-w-[17ch] text-[clamp(1.85rem,5vw,3.7rem)] leading-[1.12] font-extrabold tracking-tighter text-balance"
        >
          {title}
        </h1>
        <p className="mt-4 max-w-[58ch] text-sm leading-loose text-pretty text-white/78 contrast-more:text-white sm:text-[0.95rem]">
          {description}
        </p>
        <div className="mt-6.5 flex flex-wrap items-center gap-3">
          {children}
        </div>
      </div>
      <div
        className="pointer-events-none absolute -top-4 right-[38%] bottom-auto -left-8 z-1 h-52 opacity-55 sm:inset-y-0 sm:right-[52%] sm:left-0 sm:h-auto sm:opacity-100"
        aria-hidden="true"
      >
        <span
          className={cn(
            ART_CARD_CLASS,
            "top-4 left-0 translate-y-4.5 -rotate-8 opacity-50 sm:top-[20%] sm:left-[1%]",
          )}
        />
        <span
          className={cn(
            ART_CARD_CLASS,
            "top-7 left-6 rotate-5 p-3.5 sm:top-1/4 sm:left-[8%] sm:p-5",
          )}
        >
          <span className="grid size-9.5 place-items-center rounded-[0.85rem] bg-white/14 [&_svg]:size-4.5">
            <HeroIcon />
          </span>
          <span className="mt-3 block text-xs font-bold text-white/85 sm:mt-5.5">
            {artLabel}
          </span>
          <span className="mt-2.5 block h-1.5 w-[68%] rounded-full bg-white/18" />
          <span className="mt-2.5 block h-1.5 w-[42%] rounded-full bg-white/18" />
          <span className="text-accent-emerald absolute bottom-4.5 left-4.5 grid size-9.5 place-items-center rounded-full border border-white/18 [&_svg]:size-4.5">
            <ShieldCheck />
          </span>
        </span>
      </div>
    </section>
  );
}
