import type { FC, ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { cn } from "@/shared/lib/utils";
import { useViewportBreakpoint } from "@/shared/hooks";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  /** How wide the panel gets on a large screen, where it is a dialog. */
  size?: "sm" | "lg";
  className?: string;
  children: ReactNode;
}

/**
 * Where the studio's settings live instead of pages. On a phone it rises from
 * the bottom, drags closed, and keeps its content clear of the home
 * indicator; on a large screen, where a drawer from the bottom edge is far
 * from the pointer, the same content is a centred dialog.
 */
export const BottomSheet: FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  size = "sm",
  className,
  children,
}) => {
  const { lg } = useViewportBreakpoint();

  if (lg) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className={cn(
            "max-h-[85dvh] grid-rows-[auto_minmax(0,1fr)] overflow-hidden p-6",
            size === "lg" ? "sm:max-w-3xl" : "sm:max-w-md",
          )}
        >
          <DialogHeader>
            <DialogTitle className="text-lg">{title}</DialogTitle>
            {description ? (
              <DialogDescription>{description}</DialogDescription>
            ) : (
              <DialogDescription className="sr-only">{title}</DialogDescription>
            )}
          </DialogHeader>
          <div className={cn("min-h-0 overflow-y-auto", className)}>
            {children}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85dvh]">
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          {description ? (
            <DrawerDescription>{description}</DrawerDescription>
          ) : (
            <DrawerDescription className="sr-only">{title}</DrawerDescription>
          )}
        </DrawerHeader>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]",
            className,
          )}
        >
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
