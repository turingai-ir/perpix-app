import { type FC } from "react";
import { MessageCircle, Send, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useActiveSubscription, usePricingFeature } from "@/feature/pricing";
import { useSupportChatWidget } from "@/feature/support-chat";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

const AppLayoutSidebarUserActions: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { openChatWidget } = useSupportChatWidget();
  const { openPricingFeature } = usePricingFeature();
  const activeSubscriptionState = useActiveSubscription();
  const telegramSupportUrl = import.meta.env.VITE_APP_PERPIX_TELEGRAM_SUPPORT;

  return (
    <div className="flex w-full flex-col gap-2">
      {activeSubscriptionState.data?.plan.is_default ? (
        <Button
          className="w-full justify-start"
          variant="ghost"
          onClick={() => openPricingFeature()}
        >
          <Sparkles />
          {t("pages.app.layout.sidebar.user.upgrade")}
        </Button>
      ) : null}
      <Button
        className="w-full justify-start"
        variant="ghost"
        onClick={() => openChatWidget()}
      >
        <MessageCircle />
        {t("pages.app.layout.sidebar.user.chatSupport")}
      </Button>
      <Button asChild className="w-full justify-start" variant="ghost">
        <a href={telegramSupportUrl} rel="noreferrer" target="_blank">
          <Send />
          {t("pages.app.layout.sidebar.user.telegramSupport")}
        </a>
      </Button>
    </div>
  );
};

export default AppLayoutSidebarUserActions;
