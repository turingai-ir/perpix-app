import { useImmerAtom } from "jotai-immer";
import { type CSSProperties, type FC, type RefObject } from "react";

import appLayoutAtom from "../../model/app-layout-state";

import AppLayoutSidebarContent from "./content";
import { SIDEBAR_SHELL_CLASS } from "./sidebar-styles";

import { cn } from "@/shared/lib/utils";
import { useAppTranslate, useViewportBreakpoint } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { useActiveSubscription, usePricingFeature } from "@/features/pricing";
import {
  useWallet,
  useWalletChargeDialog,
  WalletChargeFlow,
} from "@/features/wallet";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/shared/ui/sheet";

const AppLayoutSidebar: FC<{
  sidebarWidth: string;
  sidebarRef: RefObject<HTMLElement | null>;
}> = ({ sidebarWidth, sidebarRef }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const breakpoints = useViewportBreakpoint();
  const walletState = useWallet();
  const activeSubscriptionState = useActiveSubscription();
  const { openPricingFeature } = usePricingFeature();
  const {
    isWalletChargeOpen,
    openWalletCharge,
    setWalletChargeOpen,
    walletChargeReason,
  } = useWalletChargeDialog();
  const balanceUsdmicro = walletState.data?.balance_usdmicro ?? 0;
  const sidebarContent = (
    <AppLayoutSidebarContent
      balanceUsdmicro={balanceUsdmicro}
      onOpenWalletCharge={() => {
        if (!breakpoints.lg) {
          setAppLayoutState((draft) => {
            draft.isSidebarOpen = false;
          });
        }
        openWalletCharge();
      }}
    />
  );

  const walletChargeFlow = (
    <WalletChargeFlow
      balanceUsdmicro={balanceUsdmicro}
      open={isWalletChargeOpen}
      onOpenChange={setWalletChargeOpen}
      reason={walletChargeReason}
      requiresSubscription={
        activeSubscriptionState.data?.plan.is_default === true
      }
      onOpenPricing={openPricingFeature}
    />
  );

  if (breakpoints.lg) {
    return (
      <>
        <aside
          ref={sidebarRef}
          inert={!appLayoutState.isSidebarOpen}
          aria-hidden={!appLayoutState.isSidebarOpen}
          className={cn(
            SIDEBAR_SHELL_CLASS,
            "text-sidebar-foreground relative flex h-full min-h-0 w-(--sidebar-width) flex-col border-e transition-[transform,opacity] duration-300 ease-in-out motion-reduce:transition-none",
            appLayoutState.isSidebarOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0",
          )}
          style={
            {
              "--sidebar-width": sidebarWidth,
            } as React.CSSProperties
          }
        >
          {sidebarContent}
        </aside>
        {walletChargeFlow}
      </>
    );
  }
  return (
    <>
      <Sheet
        open={appLayoutState.isSidebarOpen}
        onOpenChange={(open) =>
          setAppLayoutState((draft) => {
            draft.isSidebarOpen = open;
          })
        }
      >
        <SheetContent
          dir="rtl"
          className={cn(
            SIDEBAR_SHELL_CLASS,
            "fixed z-60 h-dvh max-h-dvh w-[min(var(--sidebar-width),100dvw)] max-w-full min-w-0 overflow-x-hidden overscroll-contain p-0",
          )}
          style={
            {
              "--sidebar-width": sidebarWidth,
            } as CSSProperties
          }
        >
          <SheetHeader>
            <SheetTitle className="sr-only">
              {t("pages.app.layout.sidebar.toggle.menu")}
            </SheetTitle>
          </SheetHeader>
          {sidebarContent}
        </SheetContent>
      </Sheet>
      {walletChargeFlow}
    </>
  );
};

export default AppLayoutSidebar;
