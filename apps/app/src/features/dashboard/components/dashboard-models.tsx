import { ArrowUpLeft, AudioLines, Image, Type, Video } from "lucide-react";
import { Link } from "react-router";
import {
  DASHBOARD_MODEL_CARD_CLASS,
  EMPTY_STATE_CLASS,
} from "../model/dashboard-styles";
import { DashboardSectionHeader } from "./dashboard-parts";

import { Skeleton } from "@/shared/ui/skeleton";
import { useAppTranslate } from "@/shared/hooks";
import { APP_ROUTES_KEY } from "@/app/router/routes";
import type { SchemaAiRegistryModelSummary } from "@/shared/api";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";

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
    <section aria-labelledby="models-heading" className="min-w-0">
      <DashboardSectionHeader
        eyebrow={t("pages.root.dashboard.models.eyebrow")}
        title={t("pages.root.dashboard.models.title")}
        titleId="models-heading"
      />
      {models.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {models.map((model) => {
            const output = model.supported_outputs[0] ?? "IMAGE";
            const OutputIcon = outputIcon[output];
            const path =
              output === "VIDEO"
                ? APP_ROUTES_KEY.generation.video.path
                : APP_ROUTES_KEY.generation.image.path;
            const minimumCost = formatTokenAmount(model.min_cost ?? 0);
            return (
              <Link
                key={model.uuid}
                to={path}
                className={DASHBOARD_MODEL_CARD_CLASS}
              >
                <span className="flex size-11 flex-none items-center justify-center overflow-hidden rounded-lg border border-foreground/9 bg-night/22 shadow-overlay inset-shadow-highlight-sm">
                  {model.icon_url ? (
                    <img
                      src={model.icon_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <OutputIcon className="h-5 w-5 text-accent-pink" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">
                    {model.display_name || model.name}
                  </span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {t("pages.root.dashboard.models.fromPrice", {
                      price: minimumCost,
                    })}
                  </span>
                </span>
                <ArrowUpLeft className="h-4 w-4 text-muted-foreground transition group-hover:text-foreground" />
              </Link>
            );
          })}
        </div>
      ) : (
        <div className={EMPTY_STATE_CLASS}>
          {t("pages.root.dashboard.models.empty")}
        </div>
      )}
    </section>
  );
}
