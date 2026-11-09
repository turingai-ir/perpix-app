import { useEffect } from "react";
import { cleanupOfflineSupport } from "../services/cleanup-offline-support";

export function RuntimeCleanup() {
  useEffect(() => {
    void cleanupOfflineSupport();
  }, []);
  return null;
}
