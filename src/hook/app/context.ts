import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import { createContext } from 'react';

import { apiClient, type paths } from '@/services/api';

export type Theme = 'dark' | 'light';

interface Context {
  apiHook: OpenapiQueryClient<paths, `${string}/${string}`>;
  theme: {
    current: Theme;
    setTheme: (theme: Theme) => void;
  };
}
export const appContext = createContext<Context>({
  apiHook: createClient(apiClient),
  theme: { current: 'dark', setTheme: () => null },
});
