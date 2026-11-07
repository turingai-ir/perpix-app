import { type FC } from "react";
import { FaTelegramPlane } from "react-icons/fa";
// import { MessageCircle } from "lucide-react";

import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
// import { useSupportChatWidget } from "@/feature/support-chat";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import AppLayoutSidebarPlanCard from "./plan-card";
import styles from "./sidebar.module.css";

const AppLayoutSidebarUserActions: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  // const { openChatWidget } = useSupportChatWidget();
  const telegramSupportUrl = import.meta.env.VITE_APP_TELEGRAM_SUPPORT;

  return (
    <div className={styles.userActions}>
      <AppLayoutSidebarPlanCard />
      {/* <Button
        className="w-full justify-start"
        variant="ghost"
        onClick={() => openChatWidget()}
      >
        <MessageCircle />
        {t("pages.app.layout.sidebar.user.chatSupport")}
      </Button> */}
      <a
        href={telegramSupportUrl}
        rel="noreferrer"
        target="_blank"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          styles.supportAction,
        )}
      >
        <FaTelegramPlane aria-hidden="true" />
        {t("pages.app.layout.sidebar.user.telegramSupport")}
      </a>
    </div>
  );
};

export default AppLayoutSidebarUserActions;
