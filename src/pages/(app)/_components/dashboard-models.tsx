import { ArrowUpLeft, AudioLines, Image, Type, Video } from "lucide-react";
import { Link } from "react-router";

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
    <section aria-labelledby="models-heading" className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs text-fuchsia-300">
            {t("pages.root.dashboard.models.eyebrow")}
          </p>
          <h2
            id="models-heading"
            className="mt-1 text-lg font-semibold text-white"
          >
            {t("pages.root.dashboard.models.title")}
          </h2>
        </div>
      </div>
      {models.length ? (
        <div className="grid gap-3 sm:grid-cols-2">
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
                className="group relative flex min-w-0 items-center gap-3 overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-br from-white/[0.065] to-white/[0.02] p-3 transition duration-300 before:absolute before:inset-y-0 before:start-0 before:w-px before:bg-gradient-to-b before:from-transparent before:via-fuchsia-300/50 before:to-transparent before:opacity-0 before:transition hover:-translate-y-0.5 hover:border-fuchsia-400/30 hover:bg-white/[0.07] hover:shadow-lg hover:shadow-fuchsia-950/20 hover:before:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fuchsia-400"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black/20 shadow-inner">
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
        <div className="rounded-xl border border-dashed border-white/10 p-6 text-center text-sm text-zinc-500">
          {t("pages.root.dashboard.models.empty")}
        </div>
      )}
    </section>
  );
}
