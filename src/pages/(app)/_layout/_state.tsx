import { atom } from "jotai";

import { getViewportBreakpoints } from "@/hook";

interface AppLayoutAtom {
  isSidebarOpen: boolean;
}
const appLayoutAtom = atom<AppLayoutAtom>({
  isSidebarOpen: getViewportBreakpoints().lg,
});
export default appLayoutAtom;
