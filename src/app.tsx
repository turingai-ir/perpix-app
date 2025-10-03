import { RouterProvider } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';

import { queryClient } from '@/lib/react-query';
import { router } from '@/router';
import { ThemeProvider } from '@/components/providers/theme';
import { Toaster } from '@/components/ui/sonner';

import './services/i18/i18';
import './styles/globals.css';
import './styles/tailwind.css';

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Toaster duration={4000} richColors position="top-center" />
          <RouterProvider router={router} />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
