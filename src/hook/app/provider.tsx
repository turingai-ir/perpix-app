import { useEffect, type FC, type PropsWithChildren } from 'react';
import createClient from 'openapi-react-query';
import { selectAtom } from 'jotai/utils';
import { useAtom } from 'jotai';

import { appContext } from './context';

import { apiClient } from '@/services/api';
import { globalAtom } from '@/state';

interface AppProviderProps {}

const themeAtom = selectAtom(globalAtom, (val) => val.theme);

const AppContextProvider: FC<PropsWithChildren<AppProviderProps>> = ({ children }) => {
  const apiHook = createClient(apiClient);
  const [myTheme] = useAtom(themeAtom);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(myTheme);
  }, [myTheme]);

  return (
    <appContext.Provider
      value={{
        apiHook,
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppContextProvider;
