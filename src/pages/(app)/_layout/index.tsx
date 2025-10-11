import { useEffect, useRef, useState, type FC } from 'react';
import { Outlet } from 'react-router';
import { useImmerAtom } from 'jotai-immer';
import { useMeasure } from 'react-use';
import { CheckIcon, ChevronsUpDownIcon, PanelRight } from 'lucide-react';

import AppLayoutSidebar from './sidebar';
import appLayoutAtom from './_state';

import { Button } from '@/components/ui/button';
import { useReactQueryApi } from '@/hook/app';
import LoadingSection from '@/components/custom/loading-section';
import ErrorSection from '@/components/custom/error-section';
import { ScrollArea } from '@/components/ui/scroll-area';
import { APP_LAYOUT_SIDEBAR_WIDTH } from '@/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { cn } from '@/lib/utils';
import { useAppTranslate } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';

const AppLayout: FC = () => {
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const [ref, scrollAreaRef] = useMeasure<HTMLDivElement>();
  const headerRef = useRef<HTMLElement>(null);
  const [openChooseModel, setOpenChooseModel] = useState(false);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const reactQueryApi = useReactQueryApi();

  const userInfoQuery = reactQueryApi.useQuery('get', '/user/get-info');

  useEffect(() => {
    if (userInfoQuery.isSuccess && userInfoQuery.data) {
      setAppLayoutState((draft) => {
        draft.walletCurrentBalance = userInfoQuery.data.default_wallet?.balance_usdmicro ?? 0;
      });
    }
  }, [userInfoQuery.isSuccess, userInfoQuery.data, setAppLayoutState]);

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
    <main
      className={`
        grid w-full overflow-hidden
        lg:grid-cols-[var(--sidebar-width,0px)_1fr]
        grid-cols-1
        transition-all duration-300 ease-in-out
        h-dvh
      `}
      style={{
        ['--sidebar-width' as any]: appLayoutState.isSidebarOpen ? APP_LAYOUT_SIDEBAR_WIDTH : '0px',
      }}
    >
      <AppLayoutSidebar sidebarWidth={APP_LAYOUT_SIDEBAR_WIDTH} />
      <ScrollArea ref={ref} className="flex flex-col relative max-h-full h-full overflow-auto">
        <header ref={headerRef} className="flex items-center sticky top-0 bg-background z-10">
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
              <PanelRight className="!w-5 !h-5" />
            ) : (
              <PanelRight className="!w-5 !h-5" />
            )}
          </Button>

          <div className="mr-auto p-2 ml-2">
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setGlobalAtom((draft) => {
                  if (draft.theme === THEMES.DARK) {
                    draft.theme = THEMES.LIGHT;
                  } else {
                    draft.theme = THEMES.DARK;
                  }
                });
              }}
            >
              {theme === THEMES.DARK ? (
                <TbSunHigh className="!w-5 !h-5" />
              ) : (
                <TbMoonStars className="!w-5 !h-5" />
              )}
            </Button> */}

            {appLayoutState.chooseModelSelect.list.length > 0 ? (
              <Popover open={openChooseModel} onOpenChange={setOpenChooseModel}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openChooseModel}
                    className="w-[200px] justify-between"
                  >
                    {appLayoutState.chooseModelSelect.currentSelectedId
                      ? appLayoutState.chooseModelSelect.list.find(
                          (framework) =>
                            framework.id === appLayoutState.chooseModelSelect.currentSelectedId,
                        )?.name
                      : ''}
                    <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      placeholder={`   ${t('pages.app.layout.chooseModel.searchBoxPlaceholder')}`}
                    />
                    <CommandList>
                      <CommandEmpty>{t('pages.app.layout.chooseModel.empty')}</CommandEmpty>
                      <CommandGroup>
                        {appLayoutState.chooseModelSelect.list.map((framework) => (
                          <CommandItem
                            key={framework.id}
                            value={framework.id}
                            onSelect={(currentValue) => {
                              setAppLayoutState((draft) => {
                                draft.chooseModelSelect.currentSelectedId = currentValue;
                              });
                              setOpenChooseModel(false);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                'mr-2 h-4 w-4',
                                appLayoutState.chooseModelSelect.currentSelectedId === framework.id
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            {framework.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            ) : null}
          </div>
        </header>
        <section
          className="flex relative"
          style={{
            // 20 px for scrollArea
            minHeight: scrollAreaRef.height - (headerRef.current?.offsetHeight ?? 0) - 20,
          }}
        >
          <Outlet />
        </section>
      </ScrollArea>
    </main>
  );
};

export default AppLayout;
