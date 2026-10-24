import { RouterProvider } from "react-router";
import { DirectionProvider } from "@radix-ui/react-direction";

import { queryClient } from "@/lib/react-query";
import { router } from "@/router/router";
import { Toaster } from "@/components/ui/sonner";
import { RuntimeCleanup } from "@/features/runtime";
import PricingFeature from "@/feature/pricing";
import { QueryClientProvider } from "@tanstack/react-query";

import "./lib/private-data";
import "./services/i18/i18";
import "./styles/globals.css";
import "./styles/tailwind.css";

function App() {
  return (
    <>
      <DirectionProvider dir="rtl">
        <QueryClientProvider client={queryClient}>
          <Toaster duration={4000} richColors position="top-center" />
          <RuntimeCleanup />
          {/* <SupportChatProvider /> */}
          <PricingFeature />
          <RouterProvider router={router} />
        </QueryClientProvider>
      </DirectionProvider>
    </>
  );
}

export default App;
