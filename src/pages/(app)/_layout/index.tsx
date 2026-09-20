import { useEffect, useEffectEvent, useRef, type FC } from "react";
import { Outlet } from "react-router";
import { useImmerAtom } from "jotai-immer";
import { Menu } from "lucide-react";

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
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

const AppLayout: FC = () => {
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const scrollAreaMyRef = useRef<HTMLDivElement>(null);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const userState = useUser();
  const sidebarToggleLabel = appLayoutState.isSidebarOpen
    ? t("pages.app.layout.sidebar.toggle.close")
    : t("pages.app.layout.sidebar.toggle.open");

  const scrollAppLayoutUntilEnd = useEffectEvent(() => {
    const el = scrollAreaMyRef.current;
    if (!el) {
      return;
    }

    const areaElement = el.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );

    if (!areaElement) {
      return;
    }
    const distanceFromEnd =
      areaElement.scrollHeight -
      areaElement.scrollTop -
      areaElement.clientHeight;
    if (distanceFromEnd > 160) return;
    areaElement.scrollTo({
      top: areaElement.scrollHeight,
      behavior: "smooth",
    });
  });

  useEffect(() => {
    const appEventBusListener = appEventBus.on(
      "SCROLL_APP_LAYOUT_UNTIL_END",
      (options) => {
        if (options?.force) {
          const viewport = scrollAreaMyRef.current?.querySelector<HTMLElement>(
            '[data-slot="scroll-area-viewport"]',
          );
          viewport?.scrollTo({
            top: viewport.scrollHeight,
            behavior: "smooth",
          });
          return;
        }
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
        className="grid h-dvh w-full min-w-0 grid-cols-[minmax(0,1fr)] grid-rows-[minmax(0,1fr)] overflow-hidden transition-[grid-template-columns] duration-300 ease-in-out lg:grid-cols-[var(--sidebar-width,0px)_minmax(0,calc(100%-var(--sidebar-width,0px)))]"
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
          className="relative flex h-full max-h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
          viewportClassName="[&>div]:!grid [&>div]:!min-h-full [&>div]:!grid-rows-[auto_1fr]"
        >
          <header className="bg-background/72 supports-[backdrop-filter]:bg-background/58 sticky top-0 z-10 flex min-h-14 w-full min-w-0 items-center border-b border-white/6 px-3 backdrop-blur-xl sm:px-5">
            <Button
              variant="ghost"
              size="sm"
              aria-expanded={appLayoutState.isSidebarOpen}
              aria-label={sidebarToggleLabel}
              title={sidebarToggleLabel}
              className="group text-foreground focus-visible:ring-primary/75 focus-visible:ring-offset-background relative min-h-11 gap-2.5 overflow-hidden rounded-full border border-white/10 bg-white/5 px-2.5 shadow-[inset_0_1px_0_rgb(255_255_255_/_12%),0_8px_24px_rgb(0_0_0_/_16%)] transition-[background,border-color,box-shadow,transform] duration-200 ease-out hover:border-white/18 hover:bg-white/9 hover:shadow-[inset_0_1px_0_rgb(255_255_255_/_18%),0_10px_28px_rgb(0_0_0_/_22%)] focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.97] active:bg-white/12 motion-reduce:transition-none"
              onClick={() => {
                setAppLayoutState((draft) => {
                  draft.isSidebarOpen = !draft.isSidebarOpen;
                });
              }}
            >
              <span
                aria-hidden="true"
                className="border-primary/25 bg-primary/12 text-primary group-hover:bg-primary/18 group-aria-expanded:bg-primary/22 flex size-8 items-center justify-center rounded-full border transition-colors duration-200 motion-reduce:transition-none"
              >
                <Menu className="size-4.5" />
              </span>
              <span className="text-sm font-semibold tracking-[-0.01em]">
                {t("pages.app.layout.sidebar.toggle.menu")}
              </span>
              <span
                aria-hidden="true"
                className="bg-primary/80 size-1.5 rounded-full shadow-[0_0_10px_currentColor] transition-transform duration-200 group-aria-expanded:scale-125 motion-reduce:transition-none"
              />
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
