import { atom } from "jotai";

import { getViewportBreakpoints } from "@/hooks/use-viewport-breakpoint";

interface AppLayoutAtom {
  isSidebarOpen: boolean;
}
const appLayoutAtom = atom<AppLayoutAtom>({
  isSidebarOpen: getViewportBreakpoints().lg,
});
export default appLayoutAtom;
