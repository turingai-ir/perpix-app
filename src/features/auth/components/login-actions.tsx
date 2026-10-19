import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

interface LoginActionsProps {
  disabled: boolean;
  onBack: () => void;
  onForgotPassword: () => Promise<void>;
}

export function LoginActions({
  disabled,
  onBack,
  onForgotPassword,
}: LoginActionsProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <>
      <Button
        type="button"
        variant="link"
        disabled={disabled}
        onClick={onForgotPassword}
      >
        {t("features.auth.login.forgotPassword")}
      </Button>
      <Button type="button" variant="link" disabled={disabled} onClick={onBack}>
        {t("features.auth.login.changePhone")}
      </Button>
    </>
  );
}
