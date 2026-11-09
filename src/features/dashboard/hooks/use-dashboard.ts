import { useRef } from "react";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { useDashboardAccount } from "./use-dashboard-account";
import { useDashboardContent } from "./use-dashboard-content";
import { useDashboardVisualQuality } from "./use-dashboard-visual-quality";

export function useDashboard() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const pageRef = useRef<HTMLDivElement>(null);
  useDashboardVisualQuality(pageRef);
  const account = useDashboardAccount();
  const allowedModels = account.subscription?.plan.allowed_models ?? [];
  const content = useDashboardContent(allowedModels);
  const hasPartialError = [
    account.subscriptionState,
    account.transactionsState,
    account.walletState,
    content.filesState,
    content.modelsState,
    content.tasksState,
  ].some((state) => state.isError);

  return {
    t,
    pageRef,
    account,
    content,
    hasPartialError,
  };
}
