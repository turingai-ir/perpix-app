import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'jotai';
import type { Store } from 'jotai/vanilla/store';

import App from './app.tsx';
import AppContextProvider from './hook/app/provider.tsx';
import { bootstrapJotai } from './lib/jotai.ts';

export let jotaiStore: Store;

const init = async () => {
  jotaiStore = await bootstrapJotai();

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={jotaiStore}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Provider>
    </StrictMode>,
  );
};

init();
