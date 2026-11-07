import { createRoot } from "react-dom/client";
import { createStore, Provider } from "jotai";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import AppContextProvider from "@/shared/hooks/app/provider";
import PricingFeature from "../pricing";
import { pricingFeatureAtom } from "../state";

export function mount() {
  const store = createStore();
  store.set(pricingFeatureAtom, {
    open: true,
    requiredModelNames: ["required-model"],
    requiredScopes: ["ai_task:write"],
  });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const host = document.createElement("div");
  document.body.replaceChildren(host);
  createRoot(host).render(
    <Provider store={store}>
      <QueryClientProvider client={client}>
        <AppContextProvider>
          <PricingFeature />
        </AppContextProvider>
      </QueryClientProvider>
    </Provider>,
  );
}
