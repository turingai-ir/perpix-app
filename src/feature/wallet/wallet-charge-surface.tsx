import {
  createContext,
  useContext,
  type ComponentProps,
  type ReactNode,
} from "react";
import { X } from "lucide-react";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { useIsMobile } from "@/shared/hooks/use-mobile";

const WalletChargeMobileContext = createContext(false);

type WalletChargeTextProps = Pick<
  ComponentProps<"h2">,
  "className" | "children"
>;

export function WalletChargeTitle(props: WalletChargeTextProps) {
  const mobile = useContext(WalletChargeMobileContext);
  return mobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />;
}

export function WalletChargeDescription(props: WalletChargeTextProps) {
  const mobile = useContext(WalletChargeMobileContext);
  return mobile ? (
    <DrawerDescription {...props} />
  ) : (
    <DialogDescription {...props} />
  );
}

type WalletChargeSurfaceProps = {
  children: ReactNode;
  closeLabel: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WalletChargeSurface({
  children,
  closeLabel,
  open,
  onOpenChange,
}: WalletChargeSurfaceProps) {
  const mobile = useIsMobile();
  const Root = mobile ? Drawer : Dialog;
  const Content = mobile ? DrawerContent : DialogContent;

  return (
    <WalletChargeMobileContext value={mobile}>
      <Root open={open} onOpenChange={onOpenChange}>
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
    </WalletChargeMobileContext>
  );
}
