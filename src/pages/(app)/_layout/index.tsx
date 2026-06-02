import { useEffect, useRef, useState, type FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useImmerAtom } from "jotai-immer";
import { useMeasure } from "react-use";
import { CheckIcon, ChevronsUpDownIcon, PanelRight } from "lucide-react";

import AppLayoutSidebar from "./sidebar";
import appLayoutAtom from "./_state";

import { Button } from "@/components/ui/button";
import { useReactQueryApi } from "@/hook/app";
import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import { APP_KEYS, APP_LAYOUT_SIDEBAR_WIDTH } from "@/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import { appEventBus } from "@/lib/event-bus";
import { ScrollArea } from "@/components/ui/scroll-area";
import PricingFeature from "@/feature/pricing";

const AppLayout: FC = () => {
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const [ref, scrollAreaRef] = useMeasure<HTMLDivElement>();
  const scrollAreaMyRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [openChooseModel, setOpenChooseModel] = useState(false);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();
  const reactQueryApi = useReactQueryApi();

  const userInfoQuery = reactQueryApi.useQuery("get", "/user/get-info");

  const location = useLocation();

  const [pricingOpen, setPricingOpen] = useState(false);

  const onOpenChange = (open: boolean) => {
    if (open) {
      navigate(APP_KEYS.URL_HASH.pricing);
    } else {
      navigate(location.pathname + location.search, { replace: true });
    }
    navigate(location.pathname + location.search, { replace: true });
  };

  useEffect(() => {
    if (location.hash === APP_KEYS.URL_HASH.pricing) {
      setPricingOpen(true);
    } else {
      setPricingOpen(false);
    }
  }, [location.hash]);

  useEffect(() => {
    if (userInfoQuery.isSuccess && userInfoQuery.data) {
      setAppLayoutState((draft) => {
        draft.walletCurrentBalance =
          userInfoQuery.data.default_wallet?.balance_usdmicro ?? 0;
      });
    }
  }, [
    userInfoQuery.isSuccess,
    userInfoQuery.data,
    setAppLayoutState,
    navigate,
  ]);

  useEffect(() => {
    const appEventBusListener = appEventBus.on(
      "SCROLL_APP_LAYOUT_UNTIL_END",
      () => {
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
      },
    );

    return () => {
      appEventBusListener();
    };
  }, [scrollAreaMyRef]);

  if (userInfoQuery.isLoading || !userInfoQuery.data) {
    return (
      <div className="w-full h-dvh mx-auto flex justify-center py-4 items-center ">
        <LoadingSection />
      </div>
    );
  }

  if (userInfoQuery.isError) {
    return (
      <div className="mx-auto flex justify-center py-4 items-center w-full h-dvh">
        <ErrorSection onRetry={() => userInfoQuery.refetch()} />
      </div>
    );
  }

  return (
    <>
      <PricingFeature
        open={pricingOpen}
        onOpenChange={(open) => {
          onOpenChange(open);
        }}
      />

      <main
        className={`
        grid w-full min-w-0 overflow-hidden
        lg:grid-cols-[var(--sidebar-width,0px)_minmax(0,calc(100%-var(--sidebar-width,0px)))]
        grid-cols-[minmax(0,1fr)]
        transition-all duration-300 ease-in-out
        h-dvh
      `}
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
              ref(r);
            }
          }}
          className="relative flex h-full max-h-full w-full min-w-0 flex-col overflow-hidden"
        >
          <header
            ref={headerRef}
            className="sticky top-0 z-10 flex w-full min-w-0 items-center bg-background"
          >
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
                <PanelRight className="w-5! h-5!" />
              ) : (
                <PanelRight className="w-5! h-5!" />
              )}
            </Button>

            <div className="ml-auto mr-2 p-2">
              {appLayoutState.chooseModelSelect.list.length > 0 ? (
                <Popover
                  open={openChooseModel}
                  onOpenChange={setOpenChooseModel}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openChooseModel}
                      className="justify-between"
                    >
                      {appLayoutState.chooseModelSelect.currentSelectedId
                        ? `${appLayoutState.chooseModelSelect.list
                            .find(
                              (framework) =>
                                framework.id ===
                                appLayoutState.chooseModelSelect
                                  .currentSelectedId,
                            )
                            ?.name.slice(0, 20)}...`
                        : ""}
                      <ChevronsUpDownIcon className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-50 p-0">
                    <Command>
                      <CommandInput
                        placeholder={`   ${t("pages.app.layout.chooseModel.searchBoxPlaceholder")}`}
                      />
                      <CommandList>
                        <CommandEmpty>
                          {t("pages.app.layout.chooseModel.empty")}
                        </CommandEmpty>
                        <CommandGroup>
                          {appLayoutState.chooseModelSelect.list.map(
                            (framework) => (
                              <CommandItem
                                key={framework.id}
                                value={framework.id}
                                onSelect={(currentValue) => {
                                  setAppLayoutState((draft) => {
                                    draft.chooseModelSelect.currentSelectedId =
                                      currentValue;
                                  });
                                  setOpenChooseModel(false);
                                }}
                              >
                                <CheckIcon
                                  className={cn(
                                    "ml-2 h-4 w-4",
                                    appLayoutState.chooseModelSelect
                                      .currentSelectedId === framework.id
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                                {framework.name}
                              </CommandItem>
                            ),
                          )}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              ) : null}
            </div>
          </header>
          <section
            className="relative flex w-full min-w-0 overflow-x-hidden"
            style={{
              // 20 px for scrollArea
              // minHeight: scrollAreaRef.height - (headerRef.current?.offsetHeight ?? 0) - 20,
              minHeight:
                scrollAreaRef.height - (headerRef.current?.offsetHeight ?? 0),
            }}
          >
            <Outlet />
          </section>
        </ScrollArea>
      </main>
    </>
  );
};

export default AppLayout;
