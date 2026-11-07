import { type ComponentProps, type FC } from "react";

import { cn } from "@/shared/lib/utils";

/** Rounded bordered tile that holds a small icon. */
export const IconTile: FC<ComponentProps<"span">> = ({
  className,
  ...props
}) => (
  <span
    className={cn(
      "grid flex-none place-items-center border [&_svg]:size-4",
      className,
    )}
    {...props}
  />
);
