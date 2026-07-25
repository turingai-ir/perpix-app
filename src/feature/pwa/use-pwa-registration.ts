import { useEffect } from "react";

import { unregisterPwaWorker } from "./services/pwa-worker";

export function usePwaRegistration(): void {
  useEffect(() => {
    void unregisterPwaWorker();
  }, []);
}

