import type { FC } from "react";
import { AlertTriangle } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import {
  CONTENT_WELL_CLASS,
  DASHBOARD_AURORA_CLASS,
  DASHBOARD_GRID_CLASS,
  DASHBOARD_GRID_LAYOUT_CLASS,
  DASHBOARD_HERO_CLASS,
  DASHBOARD_PAGE_CLASS,
  DASHBOARD_SHELL_CLASS,
} from "../model/dashboard-styles";
import { useDashboard } from "../hooks/use-dashboard";
import { DashboardAccount } from "./dashboard-account";
import { DashboardActivity } from "./dashboard-activity";
import { DashboardCreativeCommand } from "./dashboard-creative-command";
import { DashboardFiles } from "./dashboard-files";
import { DashboardModels } from "./dashboard-models";
import { DashboardResume } from "./dashboard-resume";
import { DashboardScrollCompanion } from "./dashboard-scroll-companion";
import { DashboardTransactions } from "./dashboard-transactions";

export const DashboardPage: FC = () => {
  const { t, pageRef, account, content, hasPartialError } = useDashboard();

  return (
    <div ref={pageRef} className={DASHBOARD_PAGE_CLASS} data-dashboard-page>
      <DashboardScrollCompanion />
      <div className={DASHBOARD_GRID_CLASS} />
      <div
        className={cn(
          DASHBOARD_AURORA_CLASS,
          "end-[8%] -top-40 bg-(--magenta-brand)",
        )}
      />
      <div
        className={cn(
          DASHBOARD_AURORA_CLASS,
          "-start-48 top-152 bg-(--cyan-brand) [animation-delay:-8s]",
        )}
      />
      <div className={DASHBOARD_SHELL_CLASS}>
        <section className={DASHBOARD_HERO_CLASS} data-dashboard-hero>
          <DashboardCreativeCommand />
        </section>
        {hasPartialError ? (
          <div
            role="status"
            className="border-warning/15 bg-warning/5 text-warning flex items-start gap-2 rounded-xl border px-4 py-3 text-xs leading-6"
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
        <div className={DASHBOARD_GRID_LAYOUT_CLASS}>
          <div className={CONTENT_WELL_CLASS} data-dashboard-panel>
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
          <aside className="min-w-0 *:not-first:mt-5">
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
