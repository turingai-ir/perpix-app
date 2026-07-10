import { RouterProvider } from "react-router";
import { DirectionProvider } from "@radix-ui/react-direction";

import {
  indexedDBPersister,
  queryClient,
  REACT_QUERY_CACHE_TIME,
} from "@/lib/react-query";
import { router } from "@/router/router";
import { Toaster } from "@/components/ui/sonner";
import { PwaRegistrationProvider } from "@/feature/pwa";
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
          persistOptions={{
            persister: indexedDBPersister,
            maxAge: REACT_QUERY_CACHE_TIME,
          }}
        >
          <Toaster duration={4000} richColors position="top-center" />
          <PwaRegistrationProvider />
          <SupportChatProvider />
          <PricingFeature />
          <RouterProvider router={router} />
        </PersistQueryClientProvider>
      </DirectionProvider>
    </>
  );
}

export default App;
