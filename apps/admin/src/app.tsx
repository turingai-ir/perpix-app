import { RouterProvider } from "react-router";
import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";

import { router } from "@/router";
import { AppContextProvider } from "@/hooks";
import {
  indexedDBPersister,
  queryClient,
  REACT_QUERY_CACHE_TIME,
} from "@/lib/react-query";

import "./styles/globals.css";
import "./styles/tailwind.css";

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{
          persister: indexedDBPersister,
          maxAge: REACT_QUERY_CACHE_TIME,
        }}
      >
        <AppContextProvider>
          <RouterProvider router={router} />
          <Toaster richColors position="top-center" dir="rtl" />
        </AppContextProvider>
      </PersistQueryClientProvider>
    </ThemeProvider>
  );
}
