import { atom } from 'jotai';

import { getViewportBreakpoints } from '@/hook';

const appLayoutAtom = atom({
  isSidebarOpen: getViewportBreakpoints().lg,
});
export default appLayoutAtom;
