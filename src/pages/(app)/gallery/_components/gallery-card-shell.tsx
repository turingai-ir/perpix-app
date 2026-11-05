import type { CSSProperties, ReactNode, Ref } from "react";
import { cn } from "@/lib/utils";

const card =
  "group border-foreground/9 bg-card/92 relative min-w-0 overflow-hidden rounded-[clamp(16px,2vw,22px)] border bg-[linear-gradient(145deg,rgb(255_255_255/5%),transparent_34%)] shadow-[inset_0_1px_rgb(255_255_255/8%),0_20px_50px_-38px_rgb(0_0_0/68%)] transition-[border-color,box-shadow,transform] duration-180 ease-out-quint contrast-more:border-foreground/44 hover:-translate-y-[3px] hover:border-primary/35 hover:shadow-[inset_0_1px_rgb(255_255_255/11%),0_28px_64px_-42px_color-mix(in_srgb,var(--primary)_38%,transparent)] hover-capable:focus-within:-translate-y-[3px] hover-capable:focus-within:border-primary/35 hover-capable:focus-within:shadow-[inset_0_1px_rgb(255_255_255/11%),0_28px_64px_-42px_color-mix(in_srgb,var(--primary)_38%,transparent)] motion-reduce:animate-none motion-reduce:duration-[0.01ms] motion-reduce:hover:transform-none motion-reduce:focus-within:transform-none";

export function GalleryCardShell({
  children,
  animated = true,
  delay = 0,
  ref,
  ...props
}: {
  children: ReactNode;
  animated?: boolean;
  delay?: number;
  ref?: Ref<HTMLElement>;
  "data-slot"?: string;
}) {
  const style: CSSProperties | undefined = animated
    ? { animationDelay: `${delay}ms` }
    : undefined;
  return (
    <article
      ref={ref}
      style={style}
      className={cn(card, animated && "animate-card-arrival")}
      {...props}
    >
      {children}
    </article>
  );
}

export const cardBodyClass =
  "flex min-h-16 min-w-0 items-center justify-between gap-2 py-[0.65rem] ps-[0.7rem] pe-[0.85rem] max-md:min-h-[3.6rem] max-md:p-2";
export const cardFactsClass = "px-[0.7rem] pb-3";
