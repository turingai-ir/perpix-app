import { Suspense, useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { RouterProvider } from "react-router";
import { DirectionProvider } from "@base-ui/react/direction-provider";

import { queryClient } from "@/shared/lib/react-query";
import { router } from "@/app/router/router";
import { Toaster } from "@/shared/ui/sonner";
import { RuntimeCleanup } from "@/features/runtime";
import { BootSplash } from "@/features/boot-splash";
import { PricingFeature, pricingFeatureAtom } from "@/features/pricing";
import { QueryClientProvider } from "@tanstack/react-query";

import "@/shared/lib/private-data";
import "@/shared/i18n/i18";
import "./styles/globals.css";
import "./styles/tailwind.css";

function App() {
  const { open: pricingOpen } = useAtomValue(pricingFeatureAtom);
  const [pricingWasOpened, setPricingWasOpened] = useState(false);

  useEffect(() => {
    if (pricingOpen) setPricingWasOpened(true);
  }, [pricingOpen]);

  return (
    <>
      <DirectionProvider direction="rtl">
        <QueryClientProvider client={queryClient}>
          <Toaster duration={4000} richColors position="top-center" />
          <RuntimeCleanup />
          {/* <SupportChatProvider /> */}
          <Suspense fallback={null}>
            {pricingWasOpened && <PricingFeature />}
          </Suspense>
          <RouterProvider router={router} />
          <BootSplash router={router} />
        </QueryClientProvider>
      </DirectionProvider>
    </>
  );
}

export default App;
