import type { ComponentProps, FC } from "react";

import { cn } from "@/shared/lib/utils";

export const VideoOutputHeader: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-between gap-2 px-3.5 py-3 sm:flex-nowrap sm:gap-4 sm:px-5 sm:py-4",
      className,
    )}
    {...props}
  />
);

export const VideoOutputTitle: FC<ComponentProps<"span">> = ({
  className,
  ...props
}) => (
  <span
    className={cn(
      "flex items-center gap-2.5 text-sm font-bold text-foreground [&_svg]:size-[18px] [&_svg]:text-primary",
      className,
    )}
    {...props}
  />
);

export const VideoOutputBadge: FC<ComponentProps<"span">> = ({
  className,
  ...props
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 text-xs text-muted-foreground [&_svg]:size-3.5",
      className,
    )}
    {...props}
  />
);

interface VideoOutputScreenProps extends ComponentProps<"div"> {
  unavailable: boolean;
  inDialog?: boolean;
}

export const VideoOutputScreen: FC<VideoOutputScreenProps> = ({
  unavailable,
  inDialog = false,
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex items-center justify-center bg-night [&_video]:block [&_video]:w-full [&_video]:object-contain",
      inDialog
        ? "[&_video]:max-h-[calc(100dvh-16rem)] sm:[&_video]:max-h-[calc(100dvh-13rem)]"
        : "min-h-40 [&_video]:max-h-[min(55dvh,32rem)]",
      unavailable && "bg-background",
      className,
    )}
    {...props}
  />
);

export const VideoOutputFooter: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-3 border-t border-border px-3.5 py-3 sm:px-5 sm:py-4",
      className,
    )}
    {...props}
  />
);

export const VideoOutputHint: FC<ComponentProps<"p">> = ({
  className,
  ...props
}) => (
  <p
    className={cn(
      "m-0 flex-[1_1_160px] text-xs leading-[1.8] text-muted-foreground",
      className,
    )}
    {...props}
  />
);

export const VideoOutputActions: FC<ComponentProps<"div">> = ({
  className,
  ...props
}) => (
  <div
    className={cn(
      "flex w-full flex-wrap items-center gap-2 *:flex-1 sm:w-auto sm:*:flex-none",
      className,
    )}
    {...props}
  />
);
