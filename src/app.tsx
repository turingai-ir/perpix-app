import { RouterProvider } from "react-router";
import { DirectionProvider } from "@radix-ui/react-direction";

import { indexedDBPersister, queryClient } from "@/lib/react-query";
import { router } from "@/router/router";
import { Toaster } from "@/components/ui/sonner";
import { PwaUpdateProvider } from "@/feature/pwa";
import { SupportChatProvider } from "@/feature/support-chat";
import PricingFeature from "@/feature/pricing";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import "./services/i18/i18";
import "./styles/globals.css";
import "./styles/tailwind.css";

function App() {
  return (
    <>
      <DirectionProvider dir="rtl">
        <PersistQueryClientProvider
          client={queryClient}
          persistOptions={{ persister: indexedDBPersister }}
        >
          <Toaster duration={4000} richColors position="top-center" />
          <PwaUpdateProvider />
          <SupportChatProvider />
          <PricingFeature />
          <RouterProvider router={router} />
        </PersistQueryClientProvider>
      </DirectionProvider>
    </>
  );
}

export default App;
