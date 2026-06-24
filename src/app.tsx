import { RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { DirectionProvider } from "@radix-ui/react-direction";

import { TooltipProvider } from "./components/ui/tooltip";

import { queryClient } from "@/lib/react-query";
import { router } from "@/router";
import { Toaster } from "@/components/ui/sonner";
import { PaymentRedirectPortal } from "@/feature/payment";

import "./services/i18/i18";
import "./styles/globals.css";
import "./styles/tailwind.css";

function App() {
  return (
    <>
      <TooltipProvider>
        <DirectionProvider dir="rtl">
          <QueryClientProvider client={queryClient}>
            <Toaster duration={4000} richColors position="top-center" />
            <PaymentRedirectPortal />
            <RouterProvider router={router} />
          </QueryClientProvider>
        </DirectionProvider>
      </TooltipProvider>
    </>
  );
}

export default App;
