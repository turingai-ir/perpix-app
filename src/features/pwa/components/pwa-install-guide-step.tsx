import type { FC, ReactNode } from "react";

interface PwaInstallGuideStepProps {
  icon: ReactNode;
  index: number;
  title: string;
  description: string;
}

export const PwaInstallGuideStep: FC<PwaInstallGuideStepProps> = ({
  icon,
  index,
  title,
  description,
}) => (
  <li className="border-border/60 bg-muted/40 flex items-center gap-3 rounded-2xl border p-3">
    <span
      aria-hidden="true"
      className="bg-primary/15 text-primary flex size-11 shrink-0 items-center justify-center rounded-xl"
    >
      {icon}
    </span>
    <div className="grid min-w-0 flex-1 gap-0.5">
      <p className="text-foreground text-sm leading-6 font-semibold">
        <span className="text-primary me-1.5">
          {index.toLocaleString("fa-IR")}.
        </span>
        {title}
      </p>
      <p className="text-muted-foreground text-xs leading-5">{description}</p>
    </div>
  </li>
);
