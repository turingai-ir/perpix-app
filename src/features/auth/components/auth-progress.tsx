import type { FC } from "react";

import { cn } from "@/shared/lib/utils";

type StepState = "current" | "done" | "upcoming";

interface AuthProgressProps {
  label: string;
  firstStep: { badge: string; text: string };
  secondStep: { badge: string; text: string };
  isFirstStep: boolean;
}

const stepClassName =
  "inline-flex items-center gap-2 text-xs font-semibold whitespace-nowrap text-muted-foreground transition-colors data-[state=current]:text-foreground motion-reduce:transition-none";

const badgeClassName =
  "grid size-7 place-items-center rounded-lg border border-border text-[11px] font-bold sm:size-8 group-data-[state=current]:border-primary group-data-[state=current]:bg-primary group-data-[state=current]:text-primary-foreground group-data-[state=current]:shadow-[0_0_18px] group-data-[state=current]:shadow-primary/40 group-data-[state=done]:border-primary/60 group-data-[state=done]:text-primary";

const Step: FC<{
  state: StepState;
  badge: string;
  text: string;
}> = ({ state, badge, text }) => (
  <span
    data-state={state}
    aria-current={state === "current" ? "step" : undefined}
    className={cn("group", stepClassName)}
  >
    <b className={badgeClassName}>{badge}</b>
    {text}
  </span>
);

export const AuthProgress: FC<AuthProgressProps> = ({
  label,
  firstStep,
  secondStep,
  isFirstStep,
}) => (
  <div
    className="mb-6 flex items-center gap-3 text-xs font-semibold"
    aria-label={label}
  >
    <Step state={isFirstStep ? "current" : "done"} {...firstStep} />
    <span className="bg-border h-px min-w-3 flex-1" aria-hidden="true">
      <i
        data-complete={!isFirstStep}
        className="ease-out-quint bg-primary block size-full origin-right scale-x-0 transition-transform duration-[260ms] data-[complete=true]:scale-x-100 motion-reduce:transition-none"
      />
    </span>
    <Step state={isFirstStep ? "upcoming" : "current"} {...secondStep} />
  </div>
);
