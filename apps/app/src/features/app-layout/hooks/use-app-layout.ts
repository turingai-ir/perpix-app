import { useEffect, useEffectEvent, useRef } from "react";
import { useImmerAtom } from "jotai-immer";

import { useAppTranslate } from "@/shared/hooks";
import { appEventBus } from "@/shared/lib/event-bus";
import { APP_I18_KEYS } from "@/shared/i18n";
import { useUser } from "@/features/user";
import { appLayoutAtom } from "../model/app-layout-state";

export function useAppLayout() {
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const userState = useUser();

  const sidebarToggleLabel = appLayoutState.isSidebarOpen
    ? t("pages.app.layout.sidebar.toggle.close")
    : t("pages.app.layout.sidebar.toggle.open");

  const scrollAppLayoutUntilEnd = useEffectEvent(() => {
    const el = scrollAreaRef.current;
    if (!el) return;

    const areaElement = el.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]',
    );
    if (!areaElement) return;

    const distanceFromEnd =
      areaElement.scrollHeight -
      areaElement.scrollTop -
      areaElement.clientHeight;
    if (distanceFromEnd > 160) return;

    areaElement.scrollTo({
      top: areaElement.scrollHeight,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  });

  useEffect(() => {
    const unsubscribe = appEventBus.on(
      "SCROLL_APP_LAYOUT_UNTIL_END",
      (options) => {
        if (options?.force) {
          const viewport = scrollAreaRef.current?.querySelector<HTMLElement>(
            '[data-slot="scroll-area-viewport"]',
          );
          viewport?.scrollTo({
            top: viewport.scrollHeight,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
              .matches
              ? "instant"
              : "smooth",
          });
          return;
        }
        scrollAppLayoutUntilEnd();
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleSidebar = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (
      appLayoutState.isSidebarOpen &&
      sidebarRef.current?.contains(document.activeElement)
    ) {
      event.currentTarget.focus({ preventScroll: true });
    }
    setAppLayoutState((draft) => {
      draft.isSidebarOpen = !draft.isSidebarOpen;
    });
  };

  return {
    appLayoutState,
    scrollAreaRef,
    sidebarRef,
    userState,
    sidebarToggleLabel,
    toggleSidebar,
  };
}
