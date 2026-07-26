import { atom } from "jotai";


interface AppLayoutAtom {
  isSidebarOpen: boolean;
}
const appLayoutAtom = atom<AppLayoutAtom>({
  // isSidebarOpen: getViewportBreakpoints().lg,
  isSidebarOpen: true,
});
export default appLayoutAtom;
