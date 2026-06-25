import { useCallback } from "react";

import type { UseSupportChatWidgetResult } from "./types";

export function useSupportChatWidget(): UseSupportChatWidgetResult {
  const openChatWidget = useCallback(() => {
    window.ILACHAT?.openWidget();
  }, []);

  return {
    openChatWidget,
  };
}
