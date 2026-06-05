"use client";

export function AiGenerationLoading() {
  return (
    <div className="relative flex h-48 w-48 items-center justify-center">
      <div className="bg-primary/15 absolute inset-0 animate-pulse rounded-full blur-2xl" />

      <div className="border-primary/10 absolute h-[10.5rem] w-[10.5rem] rounded-full border" />

      <div className="border-t-primary/80 border-r-primary/30 absolute h-36 w-36 animate-spin rounded-full border-2 border-transparent [animation-duration:1.6s]" />

      <div className="border-b-primary/60 direction-[reverse] absolute h-24 w-24 animate-spin rounded-full border border-transparent [animation-duration:2.4s]" />

      <div className="border-primary/20 bg-background relative flex h-[66px] w-[66px] items-center justify-center rounded-3xl border shadow-[0_0_45px_hsl(var(--primary)/0.35)]">
        <div className="bg-primary h-6 w-6 animate-pulse rounded-full shadow-[0_0_27px_hsl(var(--primary))]" />
      </div>
    </div>
  );
}
