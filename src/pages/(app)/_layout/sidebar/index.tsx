import { useImmerAtom } from 'jotai-immer';
import type { FC } from 'react';

import appLayoutAtom from '../_state';

import AppLayoutSidebarContent from './content';

import { cn } from '@/lib/utils';
import { useViewportBreakpoint } from '@/hook';

const AppLayoutSidebar: FC<{ sidebarWidth: string }> = ({ sidebarWidth }) => {
  const [appLayoutState] = useImmerAtom(appLayoutAtom);
  const breakpoints = useViewportBreakpoint();
  console.log({ breakpoints });

  if (breakpoints.lg) {
    return (
      <>
        <aside
          className={cn(
            `flex h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out`,

            appLayoutState.isSidebarOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0',
          )}
          style={
            {
              '--sidebar-width': sidebarWidth,
            } as React.CSSProperties
          }
        >
          <AppLayoutSidebarContent />
        </aside>
      </>
    );
  }
  return null;
};

export default AppLayoutSidebar;
