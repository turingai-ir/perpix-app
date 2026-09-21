import type { ReactNode } from "react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

type WalletChargeSurfaceProps = {
  children: ReactNode;
  closeLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger: ReactNode;
};

export function WalletChargeSurface({
  children,
  closeLabel,
  open,
  onOpenChange,
  trigger,
}: WalletChargeSurfaceProps) {
  const mobile = useIsMobile();
  const Root = mobile ? Drawer : Dialog;
  const Trigger = mobile ? DrawerTrigger : DialogTrigger;
  const Content = mobile ? DrawerContent : DialogContent;

  return (
    <Root open={open} onOpenChange={onOpenChange}>
      <Trigger asChild>{trigger}</Trigger>
      <Content
        className="bg-popover max-h-[90dvh] overflow-hidden border-white/10 p-0 shadow-2xl sm:max-w-lg"
        {...(!mobile ? { showCloseButton: false } : {})}
      >
        <Button
          type="button"
          size="icon"
          variant="ghost"
          aria-label={closeLabel}
          className="absolute end-3 top-3 z-10 size-11 rounded-full transition-transform duration-150 active:scale-[0.96]"
          onClick={() => onOpenChange(false)}
        >
          <X aria-hidden="true" />
        </Button>
        <div className="overflow-y-auto overscroll-contain px-5 pt-6 pb-[calc(1.25rem+env(safe-area-inset-bottom,0px))] sm:px-6 sm:pb-6">
          {children}
        </div>
      </Content>
    </Root>
  );
}
