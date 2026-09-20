import { ArrowUpLeft, AudioLines, Image, Type, Video } from "lucide-react";
import { Link } from "react-router";
import styles from "../dashboard.module.css";

import { Skeleton } from "@/components/ui/skeleton";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";
import type { SchemaAiRegistryModelSummary } from "@/services/api";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber, microDollarToToken } from "@/utils";

interface DashboardModelsProps {
  isLoading: boolean;
  models: SchemaAiRegistryModelSummary[];
}

const outputIcon = {
  AUDIO: AudioLines,
  IMAGE: Image,
  TEXT: Type,
  VIDEO: Video,
};

export function DashboardModels({ isLoading, models }: DashboardModelsProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  if (isLoading) return <Skeleton className="h-56 w-full rounded-2xl" />;

  return (
    <section aria-labelledby="models-heading" className={styles.contentSection}>
      <div className={styles.sectionHeader}>
        <div>
          <p className={styles.sectionEyebrow}>
            {t("pages.root.dashboard.models.eyebrow")}
          </p>
          <h2 id="models-heading" className={styles.sectionTitle}>
            {t("pages.root.dashboard.models.title")}
          </h2>
        </div>
      </div>
      {models.length ? (
        <div className={styles.modelGrid}>
          {models.map((model) => {
            const output = model.supported_outputs[0] ?? "IMAGE";
            const OutputIcon = outputIcon[output];
            const path =
              output === "VIDEO"
                ? APP_ROUTES_KEY.generation.video.path
                : APP_ROUTES_KEY.generation.image.path;
            const minimumCost = formatLocalizedNumber({
              value: microDollarToToken(model.min_cost ?? 0),
            });
            return (
              <Link
                key={model.uuid}
                to={path}
                className={`group ${styles.modelCard}`}
              >
                <span className={styles.modelIcon}>
                  {model.icon_url ? (
                    <img
                      src={model.icon_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <OutputIcon className="h-5 w-5 text-fuchsia-300" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-white">
                    {model.display_name || model.name}
                  </span>
                  <span className="mt-1 block truncate text-xs text-zinc-500">
                    {t("pages.root.dashboard.models.fromPrice", {
                      price: minimumCost,
                    })}
                  </span>
                </span>
                <ArrowUpLeft className="h-4 w-4 text-zinc-600 transition group-hover:text-white" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={styles.emptyState}>
          {t("pages.root.dashboard.models.empty")}
        </div>
      )}
    </section>
  );
}
