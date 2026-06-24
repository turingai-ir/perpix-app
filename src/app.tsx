import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "@radix-ui/react-direction";

import { queryClient } from "@/lib/react-query";
import { router } from "@/router/router";
import { Toaster } from "@/components/ui/sonner";
import { PwaUpdateProvider } from "@/feature/pwa";

import "./services/i18/i18";
import "./styles/globals.css";
import "./styles/tailwind.css";

function App() {
  return (
    <>
      <DirectionProvider dir="rtl">
        <QueryClientProvider client={queryClient}>
          <Toaster duration={4000} richColors position="top-center" />
          <PwaUpdateProvider />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </DirectionProvider>
    </>
  );
}

export default App;
