import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app.tsx';
import AppContextProvider from './hook/app/provider.tsx';

const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider
      theme={{
        default: systemTheme,
        storageKey: 'per-pix-ai-theme',
      }}
    >
      <App />
    </AppContextProvider>
  </StrictMode>,
);
