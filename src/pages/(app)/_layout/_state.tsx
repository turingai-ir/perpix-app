import { atom } from "jotai";

import { getViewportBreakpoints } from "@/shared/hooks/use-viewport-breakpoint";

interface AppLayoutAtom {
  isSidebarOpen: boolean;
  isWalletChargeOpen: boolean;
}
const appLayoutAtom = atom<AppLayoutAtom>({
  isSidebarOpen: getViewportBreakpoints().lg,
  isWalletChargeOpen: false,
});
export default appLayoutAtom;
