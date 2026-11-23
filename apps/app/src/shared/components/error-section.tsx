import type { FC, PropsWithChildren } from "react";

import { Muted } from "@/shared/ui/typography";
import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

interface Props {
  onRetry?: () => void;
}

const ErrorSection: FC<PropsWithChildren<Props>> = ({ children, onRetry }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="flex flex-col gap-4">
      <Muted>{t("components.custom.errorSection.description")}</Muted>
      {onRetry ? (
        <Button onClick={onRetry}>
          {t("components.custom.errorSection.retry")}
        </Button>
      ) : null}
      {children}
    </div>
  );
};

export default ErrorSection;
