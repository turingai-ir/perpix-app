import { atom } from "jotai";

import { getViewportBreakpoints } from "@/shared/hooks/use-viewport-breakpoint";

export interface AppLayoutState {
  isSidebarOpen: boolean;
}

export const appLayoutAtom = atom<AppLayoutState>({
  isSidebarOpen: getViewportBreakpoints().lg,
});

export default appLayoutAtom;
