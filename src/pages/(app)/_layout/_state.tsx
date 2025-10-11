import { atom } from 'jotai';

import { getViewportBreakpoints } from '@/hook';

interface AppLayoutAtom {
  isSidebarOpen: boolean;
  chooseModelSelect: {
    list: {
      name: string;
      id: string;
      description?: string;
    }[];
    currentSelectedId?: string;
  };
  walletCurrentBalance: number;
}
const appLayoutAtom = atom<AppLayoutAtom>({
  isSidebarOpen: getViewportBreakpoints().lg,
  chooseModelSelect: {
    list: [],
    currentSelectedId: undefined,
  },
  walletCurrentBalance: 0,
});
export default appLayoutAtom;
