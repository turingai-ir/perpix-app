import { CircleCheck, Sparkles, WandSparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface DashboardWelcomeProps {
  isNewUser: boolean;
  isVerified: boolean;
  userName: string | null;
}

export function DashboardWelcome({
  isNewUser,
  isVerified,
  userName,
}: DashboardWelcomeProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const displayName = userName || t("pages.root.dashboard.welcome.defaultName");

  return (
    <div className="relative flex min-w-0 flex-col justify-center gap-5 p-1 sm:p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-2 text-xs font-medium text-fuchsia-200">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          {t("pages.root.dashboard.welcome.eyebrow")}
        </span>
        {isVerified ? (
          <Badge className="border-emerald-400/20 bg-emerald-400/10 text-emerald-200">
            <CircleCheck aria-hidden="true" />
            {t("pages.root.dashboard.account.verified")}
          </Badge>
        ) : null}
      </div>
      <div className="space-y-3">
        <h1 className="max-w-xl text-3xl leading-tight font-semibold tracking-[-0.035em] text-white sm:text-5xl lg:text-[3.35rem]">
          {t(
            `pages.root.dashboard.welcome.${isNewUser ? "new" : "returning"}.title`,
            { name: displayName },
          )}
        </h1>
        <p className="max-w-xl text-sm leading-7 text-zinc-300 sm:text-base">
          {t(
            `pages.root.dashboard.welcome.${isNewUser ? "new" : "returning"}.description`,
          )}
        </p>
      </div>
      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-fuchsia-300/20 bg-fuchsia-400/10 text-fuchsia-200">
          <WandSparkles className="h-4 w-4" aria-hidden="true" />
        </span>
        {t("pages.root.dashboard.welcome.hint")}
      </div>
    </div>
  );
}
