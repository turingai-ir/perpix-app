import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './app.tsx';
import AppContextProvider from './hook/app/provider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>,
);
