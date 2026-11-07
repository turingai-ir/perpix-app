import { ArrowUpLeft, AudioLines, Image, Type, Video } from "lucide-react";
import { Link } from "react-router";
import {
  DASHBOARD_MODEL_CARD_CLASS,
  EMPTY_STATE_CLASS,
} from "./dashboard-styles";
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
                <span className="border-foreground/9 flex size-11 flex-none items-center justify-center overflow-hidden rounded-[0.8rem] border bg-black/22 shadow-[inset_0_1px_rgb(255_255_255/6%),0_8px_20px_-14px_rgb(0_0_0/80%)]">
                  {model.icon_url ? (
                    <img
                      src={model.icon_url}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <OutputIcon className="text-accent-pink h-5 w-5" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-foreground block truncate text-sm font-semibold">
                    {model.display_name || model.name}
                  </span>
                  <span className="text-muted-foreground mt-1 block truncate text-xs">
                    {t("pages.root.dashboard.models.fromPrice", {
                      price: minimumCost,
                    })}
                  </span>
                </span>
                <ArrowUpLeft className="text-muted-foreground group-hover:text-foreground h-4 w-4 transition" />
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
