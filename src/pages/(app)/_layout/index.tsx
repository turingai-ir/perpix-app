import type { FC } from 'react';
import { TbLayoutSidebarRightCollapse, TbLayoutSidebarRightExpand } from 'react-icons/tb';
import { Outlet } from 'react-router';
import { useImmerAtom } from 'jotai-immer';

import AppLayoutSidebar from './sidebar';
import appLayoutAtom from './_state';

import { Button } from '@/components/ui/button';
import { useReactQueryApi } from '@/hook/app';
import LoadingSection from '@/components/custom/loading-section';
import ErrorSection from '@/components/custom/error-section';

const SIDEBAR_WIDTH = '16rem';

const AppLayout: FC = () => {
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);

  const reactQueryApi = useReactQueryApi();

  const userInfoQuery = reactQueryApi.useQuery('get', '/user/get-info');

  if (userInfoQuery.isLoading) {
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
        ['--sidebar-width' as any]: appLayoutState.isSidebarOpen ? SIDEBAR_WIDTH : '0px',
      }}
    >
      <AppLayoutSidebar sidebarWidth={SIDEBAR_WIDTH} />
      <div className="flex flex-col relative h-full ">
        <header className="flex items-center sticky top-0">
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
              <TbLayoutSidebarRightCollapse className="!w-5 !h-5" />
            ) : (
              <TbLayoutSidebarRightExpand className="!w-5 !h-5" />
            )}
          </Button>

          <div className="mr-auto">
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
          </div>
        </header>
        <section>
          <Outlet />
        </section>
      </div>
    </main>
  );
};

export default AppLayout;
