import type { FC, ReactNode } from "react";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { cn } from "@/shared/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Where the studio's settings live instead of dialogs: it rises from the
 * bottom, drags closed, and keeps its content clear of the home indicator.
 */
export const BottomSheet: FC<BottomSheetProps> = ({
  open,
  onOpenChange,
  title,
  description,
  className,
  children,
}) => (
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
