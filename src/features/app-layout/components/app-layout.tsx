import type { FC } from "react";
import { Outlet } from "react-router";
import { Menu } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { ScrollArea } from "@/shared/ui/scroll-area";
import { TooltipProvider } from "@/shared/ui/tooltip";
import LoadingSection from "@/shared/components/loading-section";
import ErrorSection from "@/shared/components/error-section";
import { APP_LAYOUT_SIDEBAR_WIDTH } from "@/shared/utils";
import { PaymentRedirectPortal } from "@/features/payment";
import { AiTaskEventsProvider } from "@/features/ai-task-events";

import AppLayoutSidebar from "./sidebar";
import HeaderSlogan from "./header-slogan";
import AccountWidget from "./account-widget/account-widget";
import { useAppLayout } from "../hooks/use-app-layout";

const HEADER_SURFACE_CLASS = [
  "@container isolate overflow-hidden border-b border-(--glass-border) bg-background",
  "bg-[radial-gradient(ellipse_36%_120%_at_50%_118%,var(--ambient-brand),transparent_74%),radial-gradient(ellipse_22%_95%_at_65%_0%,var(--ambient-media),transparent_85%),linear-gradient(90deg,transparent,rgb(15_11_28/65%)_25%,rgb(15_11_28/65%)_75%,transparent)]",
  "shadow-[inset_0_-1px_0_rgb(54_202_255/11%)]",
  "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:content-[''] before:bg-[linear-gradient(rgb(167_70_222/11%)_1px,transparent_1px),linear-gradient(90deg,rgb(68_186_243/9%)_1px,transparent_1px)] before:bg-[size:16px_16px] before:mask-[linear-gradient(90deg,transparent_8%,#000_30%_70%,transparent_92%)]",
  "after:pointer-events-none after:absolute after:inset-x-[21%] after:bottom-0 after:h-px after:content-[''] after:bg-[linear-gradient(90deg,transparent,var(--image-accent)_35%,var(--video-accent)_65%,transparent)] after:shadow-[0_0_10px_rgb(174_49_235/55%)]",
].join(" ");

export const AppLayout: FC = () => {
  const {
    appLayoutState,
    scrollAreaRef,
    sidebarRef,
    userState,
    sidebarToggleLabel,
    toggleSidebar,
  } = useAppLayout();

  if (userState.isError) {
    return (
      <div className="mx-auto flex h-dvh w-full items-center justify-center py-4">
        <ErrorSection onRetry={() => userState.refetch()} />
      </div>
    );
  }

  if (userState.isLoading || !userState.data) {
    return (
      <div className="mx-auto flex h-dvh w-full items-center justify-center py-4">
        <LoadingSection />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <PaymentRedirectPortal />
      <AiTaskEventsProvider />

      <main
        className="grid h-dvh w-full min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out lg:grid-cols-[var(--sidebar-width,0px)_minmax(0,calc(100%-var(--sidebar-width,0px)))]"
        style={{
          ["--sidebar-width" as any]: appLayoutState.isSidebarOpen
            ? APP_LAYOUT_SIDEBAR_WIDTH
            : "0px",
        }}
      >
        <AppLayoutSidebar
          sidebarWidth={APP_LAYOUT_SIDEBAR_WIDTH}
          sidebarRef={sidebarRef}
        />
        <ScrollArea
          ref={(r) => {
            if (r) {
              scrollAreaRef.current = r;
            }
          }}
          className="relative flex h-full max-h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
          viewportClassName="[&>div]:!grid [&>div]:!min-h-full [&>div]:!grid-rows-[auto_1fr]"
        >
          <header
            className={`${HEADER_SURFACE_CLASS} sticky top-0 z-10 flex min-h-[68px] w-full min-w-0 items-center px-3 sm:px-5`}
          >
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={appLayoutState.isSidebarOpen}
              aria-label={sidebarToggleLabel}
              title={sidebarToggleLabel}
              className="group text-foreground focus-visible:ring-primary/75 focus-visible:ring-offset-background relative min-h-11 gap-2.5 overflow-hidden rounded-full border border-white/10 bg-white/5 px-2.5 shadow-[inset_0_1px_0_rgb(255_255_255_/_12%),0_8px_24px_rgb(0_0_0_/_16%)] transition-[background,border-color,box-shadow,transform] duration-200 ease-out hover:border-white/18 hover:bg-white/9 hover:shadow-[inset_0_1px_0_rgb(255_255_255_/_18%),0_10px_28px_rgb(0_0_0_/_22%)] focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] active:bg-white/12 motion-reduce:transition-none"
              onClick={toggleSidebar}
            >
              <span className="relative flex h-4 w-4 items-center justify-center">
                <Menu className="h-4 w-4 transition-transform duration-200 ease-out group-hover:scale-110" />
              </span>
            </Button>
            <HeaderSlogan />
            <AccountWidget />
          </header>
          <Outlet />
        </ScrollArea>
      </main>
    </TooltipProvider>
  );
};

export default AppLayout;
