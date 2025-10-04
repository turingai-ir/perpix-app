import { useEffect, useState, type FC, type PropsWithChildren } from 'react';
import createClient from 'openapi-react-query';

import { appContext, type Theme } from './context';

import { apiClient } from '@/services/api';
import { cookies } from '@/utils/cookies';

interface AppProviderProps {
  theme: {
    default: Theme;
    storageKey: string;
  };
}
const AppContextProvider: FC<PropsWithChildren<AppProviderProps>> = ({ children, theme }) => {
  const [myTheme, setMyTheme] = useState<Theme>(
    () => (cookies().get(theme.storageKey) as Theme) || theme.default,
  );
  const apiHook = createClient(apiClient);

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove('light', 'dark');

    root.classList.add(myTheme);
  }, [myTheme]);

  return (
    <appContext.Provider
      value={{
        apiHook,
        theme: {
          current: myTheme,
          setTheme(t) {
            cookies().set(theme.storageKey, t);
            setMyTheme(t);
          },
        },
      }}
    >
      {children}
    </appContext.Provider>
  );
};

export default AppContextProvider;
