import type { FC } from "react";
import { CreditCard, History, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { APP_ROUTES_KEY } from "@/router/routes";
import { cn } from "@/lib/utils";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

const profileNavItems = [
  {
    to: APP_ROUTES_KEY.profile.settings.path,
    label: "pages.profile.settings.accountDetails",
    icon: Settings,
  },
  {
    to: APP_ROUTES_KEY.profile.payments.path,
    label: "pages.profile.payments.title",
    icon: CreditCard,
  },
  {
    to: APP_ROUTES_KEY.profile.walletTransactions.path,
    label: "pages.profile.walletTransactions.title",
    icon: History,
  },
];

const ProfileLayout: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="bg-background min-h-full w-full">
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
        <header className="border-border bg-card/70 sticky top-0 z-10 mb-4 rounded-lg border p-2 backdrop-blur">
          <nav
            className="grid grid-cols-3 gap-1 sm:flex sm:gap-2 sm:overflow-x-auto"
            aria-label={t("pages.app.layout.sidebar.user.account")}
          >
            {profileNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-muted-foreground hover:bg-muted hover:text-foreground flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-md px-1 text-center text-xs font-medium transition-colors sm:h-10 sm:shrink-0 sm:gap-2 sm:px-3 sm:text-sm",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )
                }
              >
                <item.icon
                  aria-hidden="true"
                  className="hidden size-4 sm:block"
                />
                <span>{t(item.label)}</span>
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="min-h-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;
