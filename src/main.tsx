import { StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { Provider } from "jotai";

import App from "./app.tsx";
import { ErrorBoundary } from "./components/custom/error-boundary.tsx";
import AppContextProvider from "./hooks/app/provider.tsx";
import { jotaiStore } from "./lib/jotai-store.ts";

const container = document.getElementById("root");

if (!container) {
  throw new Error('Root element with id "root" was not found.');
}

type RootContainer = HTMLElement & { __reactRoot?: Root };

const rootContainer = container as RootContainer;

if (!rootContainer.__reactRoot) {
  rootContainer.__reactRoot = createRoot(rootContainer);
}

const root = rootContainer.__reactRoot;

root.render(
  <StrictMode>
    <ErrorBoundary>
      <Provider store={jotaiStore}>
        <AppContextProvider>
          <App />
        </AppContextProvider>
      </Provider>
    </ErrorBoundary>
  </StrictMode>,
);

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    root.unmount();
    rootContainer.__reactRoot = undefined;
  });
}
