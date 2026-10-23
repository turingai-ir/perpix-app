import { AlertTriangle } from "lucide-react";

import { DashboardAccount } from "./_components/dashboard-account";
import { DashboardActivity } from "./_components/dashboard-activity";
import { DashboardCreativeCommand } from "./_components/dashboard-creative-command";
import { DashboardFiles } from "./_components/dashboard-files";
import { DashboardModels } from "./_components/dashboard-models";
import { DashboardResume } from "./_components/dashboard-resume";
import { DashboardScrollCompanion } from "./_components/dashboard-scroll-companion";
import { DashboardTransactions } from "./_components/dashboard-transactions";
import styles from "./dashboard.module.css";
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
    <div
      className={`${styles.page} relative min-h-full w-full overflow-hidden text-zinc-100`}
    >
      <DashboardScrollCompanion />
      <div className={`${styles.grid} pointer-events-none`} />
      <div
        className={`${styles.aurora} pointer-events-none end-[8%] -top-40 bg-fuchsia-500`}
      />
      <div
        className={`${styles.aurora} pointer-events-none -start-48 top-[38rem] bg-sky-500 [animation-delay:-8s]`}
      />
      <div className={styles.dashboardShell}>
        <section className={styles.hero}>
          <DashboardCreativeCommand />
        </section>
        {hasPartialError ? (
          <div
            role="status"
            className="flex items-start gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-3 text-xs leading-6 text-amber-200"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {t("pages.root.dashboard.partialError")}
          </div>
        ) : null}
        <DashboardResume task={content.tasks[0]} />
        <DashboardAccount
          isLoading={
            account.walletState.isPending || account.subscriptionState.isPending
          }
          subscription={account.subscription}
          user={account.user}
          wallet={account.wallet}
        />
        <div className={styles.dashboardGrid}>
          <div className={styles.contentWell}>
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
          <aside className={styles.sideRail}>
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
