import { useId } from "react";
import { Link } from "react-router";

import type { GenerationHistoryErrorKind } from "../model/conversation";

import { Button, buttonVariants } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";

interface Props {
  kind: GenerationHistoryErrorKind;
  isRetrying: boolean;
  newConversationPath: string;
  onRetry: () => void;
}

export function GenerationHistoryError({
  kind,
  isRetrying,
  newConversationPath,
  onRetry,
}: Props) {
  const { t } = useAppTranslate();
  const titleId = useId();

  return (
    <section
      role="alert"
      aria-labelledby={titleId}
      aria-busy={isRetrying}
      className="mx-auto flex max-h-full min-h-0 w-full max-w-2xl flex-col gap-4 overflow-y-auto rounded-2xl border border-border bg-background/90 p-5"
    >
      <h2 id={titleId} className="text-lg font-semibold">
        {t(`pages.generation.historyError.${kind}.title`)}
      </h2>
      <p className="text-sm leading-7 text-muted-foreground">
        {t(`pages.generation.historyError.${kind}.description`)}
      </p>
      <div className="flex flex-wrap gap-3">
        {kind === "temporary" && (
          <Button disabled={isRetrying} onClick={() => onRetry()}>
            {t("pages.generation.historyError.retry")}
          </Button>
        )}
        <Link
          to={newConversationPath}
          className={buttonVariants({ variant: "outline" })}
        >
          {t("pages.generation.historyError.newConversation")}
        </Link>
      </div>
    </section>
  );
}
