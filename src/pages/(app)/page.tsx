import { AlertTriangle } from "lucide-react";

import { DashboardAccount } from "./_components/dashboard-account";
import { DashboardActivity } from "./_components/dashboard-activity";
import { DashboardFiles } from "./_components/dashboard-files";
import { DashboardModels } from "./_components/dashboard-models";
import { DashboardTransactions } from "./_components/dashboard-transactions";
import { DashboardWelcome } from "./_components/dashboard-welcome";
import { useDashboardAccount } from "./_hooks/use-dashboard-account";
import { useDashboardContent } from "./_hooks/use-dashboard-content";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

const AppPage = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
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

  return (
    <div className="relative min-h-full w-full overflow-hidden bg-[#08090c] text-zinc-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_70%_0%,rgba(168,85,247,0.09),transparent_48%)]" />
      <div className="relative mx-auto w-full max-w-[1500px] space-y-5 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
        <DashboardWelcome
          isVerified={account.user?.is_verified ?? false}
          userName={account.user?.name ?? null}
        />
        {hasPartialError ? (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-3 text-xs leading-6 text-amber-200"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {t("pages.root.dashboard.partialError")}
          </div>
        ) : null}
        <DashboardAccount
          isLoading={
            account.walletState.isPending || account.subscriptionState.isPending
          }
          subscription={account.subscription}
          user={account.user}
          wallet={account.wallet}
        />
        <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(19rem,0.75fr)]">
          <div className="min-w-0 space-y-7 rounded-2xl border border-white/8 bg-black/20 p-4 sm:p-5">
            <DashboardFiles
              files={content.files}
              isLoading={content.filesState.isPending}
              previews={content.previewsState.data ?? {}}
            />
            <DashboardModels
              isLoading={content.modelsState.isPending}
              models={content.featuredModels}
            />
          </div>
          <aside className="min-w-0 space-y-5">
            <DashboardActivity
              isLoading={content.tasksState.isPending}
              tasks={content.tasks}
            />
            <DashboardTransactions
              isLoading={account.transactionsState.isPending}
              transactions={account.transactions ?? []}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
