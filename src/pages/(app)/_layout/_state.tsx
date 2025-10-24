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
  sidebarHistoryChats: {
    list: { title: string; id: string; link: string }[];
    isLoading: boolean;
    isError: boolean;
    AllItemsFetched: boolean;
  };
}
const appLayoutAtom = atom<AppLayoutAtom>({
  isSidebarOpen: getViewportBreakpoints().lg,
  chooseModelSelect: {
    list: [],
    currentSelectedId: undefined,
  },
  walletCurrentBalance: 0,
  sidebarHistoryChats: {
    list: [],
    isLoading: false,
    isError: false,
    AllItemsFetched: false,
  },
});
export default appLayoutAtom;
