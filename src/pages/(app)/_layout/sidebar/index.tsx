import { useImmerAtom } from 'jotai-immer';
import { type FC } from 'react';

import appLayoutAtom from '../_state';

import AppLayoutSidebarContent from './content';

import { cn } from '@/lib/utils';
import { useViewportBreakpoint } from '@/hook';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

const AppLayoutSidebar: FC<{ sidebarWidth: string }> = ({ sidebarWidth }) => {
  const [appLayoutState, setAppLayoutState] = useImmerAtom(appLayoutAtom);
  const breakpoints = useViewportBreakpoint();

  if (breakpoints.lg) {
    return (
      <>
        <aside
          className={cn(
            'flex h-full w-[var(--sidebar-width)] flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out',
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
  return (
    <Sheet
      open={appLayoutState.isSidebarOpen}
      onOpenChange={(open) =>
        setAppLayoutState((draft) => {
          draft.isSidebarOpen = open;
        })
      }
    >
      <SheetContent
        className="w-[var(--sidebar-width)]"
        style={
          {
            '--sidebar-width': sidebarWidth,
          } as React.CSSProperties
        }
      >
        <SheetHeader>
          <SheetTitle />
        </SheetHeader>
        <AppLayoutSidebarContent />
      </SheetContent>
    </Sheet>
  );
};

export default AppLayoutSidebar;
