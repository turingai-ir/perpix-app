import { useEffect, useEffectEvent, useRef, type FC } from "react";
import { Outlet } from "react-router";
import { useImmerAtom } from "jotai-immer";
import { PanelRight } from "lucide-react";

import AppLayoutSidebar from "./sidebar";
import appLayoutAtom from "./_state";

import { Button } from "@/components/ui/button";
import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import { APP_LAYOUT_SIDEBAR_WIDTH } from "@/utils";

import { appEventBus } from "@/lib/event-bus";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PaymentRedirectPortal } from "@/feature/payment";
import { useUser } from "@/feature/user";
import { AiTaskEventsProvider } from "@/feature/ai-task-events";

const AppLayout: FC = () => {
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const scrollAreaMyRef = useRef<HTMLDivElement>(null);

  const userState = useUser();

  const scrollAppLayoutUntilEnd = useEffectEvent(() => {
    const el = scrollAreaMyRef.current;
    if (!el) {
      return;
    }

    const areaElement = el.childNodes[1] as HTMLDivElement;

    if (!areaElement) {
      return;
    }
    areaElement.scrollTo({
      top: areaElement.scrollHeight,
      behavior: "smooth",
    });
  });

  useEffect(() => {
    const appEventBusListener = appEventBus.on(
      "SCROLL_APP_LAYOUT_UNTIL_END",
      () => {
        scrollAppLayoutUntilEnd();
      },
    );

    return () => {
      appEventBusListener();
    };
  }, []);

  if (userState.isLoading || !userState.data) {
    return (
      <div className="mx-auto flex h-dvh w-full items-center justify-center py-4">
        <LoadingSection />
      </div>
    );
  }

  if (userState.isError) {
    return (
      <div className="mx-auto flex h-dvh w-full items-center justify-center py-4">
        <ErrorSection onRetry={() => userState.refetch()} />
      </div>
    );
  }

  return (
    <TooltipProvider>
      <PaymentRedirectPortal />
      <AiTaskEventsProvider />

      <main
        className="grid h-dvh w-full min-w-0 grid-cols-[minmax(0,1fr)] overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out lg:grid-cols-[var(--sidebar-width,0px)_minmax(0,calc(100%-var(--sidebar-width,0px)))]"
        style={{
          ["--sidebar-width" as any]: appLayoutState.isSidebarOpen
            ? APP_LAYOUT_SIDEBAR_WIDTH
            : "0px",
        }}
      >
        <AppLayoutSidebar sidebarWidth={APP_LAYOUT_SIDEBAR_WIDTH} />
        <ScrollArea
          ref={(r) => {
            if (r) {
              scrollAreaMyRef.current = r;
            }
          }}
          className="relative flex h-full max-h-full w-full min-w-0 flex-col overflow-hidden"
          viewportClassName="[&>div]:!grid [&>div]:!min-h-full [&>div]:!grid-rows-[auto_1fr]"
        >
          <header className="bg-background sticky top-0 z-10 flex w-full min-w-0 items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setAppLayoutState((draft) => {
                  draft.isSidebarOpen = !draft.isSidebarOpen;
                });
              }}
            >
              {appLayoutState.isSidebarOpen ? (
                <PanelRight className="h-5! w-5!" />
              ) : (
                <PanelRight className="h-5! w-5!" />
              )}
            </Button>
          </header>
          <section className="relative flex w-full min-w-0 overflow-x-hidden">
            <Outlet />
          </section>
        </ScrollArea>
      </main>
    </TooltipProvider>
  );
};

export default AppLayout;
