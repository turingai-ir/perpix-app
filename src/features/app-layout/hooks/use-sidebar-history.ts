import { useMemo } from "react";
import { useLocation } from "react-router";

import {
  getHistoryTaskType,
  getUniqueHistoryItems,
} from "../model/sidebar-history";

import { useAiTasksList } from "@/features/generation";

/** Task history of the studio on the current route. */
export function useSidebarHistory() {
  const { pathname } = useLocation();
  const taskType = useMemo(() => getHistoryTaskType(pathname), [pathname]);
  const { aiTasksListStatus } = useAiTasksList(taskType);
  const historyItems = useMemo(
    () => getUniqueHistoryItems(aiTasksListStatus.data?.pages),
    [aiTasksListStatus.data?.pages],
  );

  return { aiTasksListStatus, historyItems, taskType };
}
