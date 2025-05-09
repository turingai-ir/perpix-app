import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './app.tsx'
import AppProvider from './hook/app/provider.tsx'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </StrictMode>,
)
