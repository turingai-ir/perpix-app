import { type FC } from "react";
import { Sparkles } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
// import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useActiveSubscription, usePricingFeature } from "@/feature/pricing";
// import { useSupportChatWidget } from "@/feature/support-chat";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import styles from "./sidebar.module.css";

const AppLayoutSidebarUserActions: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  // const { openChatWidget } = useSupportChatWidget();
  const { openPricingFeature } = usePricingFeature();
  const activeSubscriptionState = useActiveSubscription();
  const telegramSupportUrl = import.meta.env.VITE_APP_TELEGRAM_SUPPORT;

  return (
    <div className={styles.userActions}>
      {activeSubscriptionState.data?.plan.is_default ? (
        <Button
          className={styles.upgradeAction}
          variant="ghost"
          onClick={() => openPricingFeature()}
        >
          <Sparkles />
          {t("pages.app.layout.sidebar.user.upgrade")}
        </Button>
      ) : null}
      {/* <Button
        className="w-full justify-start"
        variant="ghost"
        onClick={() => openChatWidget()}
      >
        <MessageCircle />
        {t("pages.app.layout.sidebar.user.chatSupport")}
      </Button> */}
      <Button asChild className={styles.supportAction} variant="ghost">
        <a href={telegramSupportUrl} rel="noreferrer" target="_blank">
          <FaTelegramPlane aria-hidden="true" />
          {t("pages.app.layout.sidebar.user.telegramSupport")}
        </a>
      </Button>
    </div>
  );
};

export default AppLayoutSidebarUserActions;
