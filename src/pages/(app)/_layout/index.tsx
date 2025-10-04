import type { FC } from 'react';
import {
  TbLayoutSidebarRightCollapse,
  TbLayoutSidebarRightExpand,
  TbMoonStars,
  TbSunHigh,
} from 'react-icons/tb';
import { Outlet } from 'react-router';
import { useImmerAtom } from 'jotai-immer';

import AppLayoutSidebar from './sidebar';
import appLayoutAtom from './_state';

import { Button } from '@/components/ui/button';
import { useApp } from '@/hook/app';

const SIDEBAR_WIDTH = '16rem';

const AppLayout: FC = () => {
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const { theme } = useApp();

  return (
    <main
      className={`
        grid w-full overflow-hidden
        grid-cols-[var(--sidebar-width,0px)_1fr]
        transition-all duration-300 ease-in-out
        h-dvh
      `}
      style={{
        ['--sidebar-width' as any]: appLayoutState.isSidebarOpen ? SIDEBAR_WIDTH : '0px',
      }}
    >
      <AppLayoutSidebar sidebarWidth={SIDEBAR_WIDTH} />
      <div className="flex flex-col relative h-full">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                theme.setTheme(theme.current === 'dark' ? 'light' : 'dark');
              }}
            >
              {theme.current === 'dark' ? (
                <TbSunHigh className="!w-5 !h-5" />
              ) : (
                <TbMoonStars className="!w-5 !h-5" />
              )}
            </Button>
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
