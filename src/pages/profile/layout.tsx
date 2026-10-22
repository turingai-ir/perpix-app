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
    label: "pages.profile.walletTransactions.navLabel",
    icon: History,
  },
];

const ProfileLayout: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <div className="bg-background min-h-full w-full">
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
        <header
          className="bg-card/70 border-primary/15 sticky top-0 z-10 mb-5 rounded-2xl border p-2 shadow-[inset_0_1px_0_rgb(255_255_255_/_12%),0_16px_36px_-24px_rgb(0_0_0_/_65%)] backdrop-blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at 90% -30%, rgb(180 80 230 / 16%), transparent 55%), linear-gradient(120deg, color-mix(in srgb, var(--card) 86%, transparent), color-mix(in srgb, var(--background) 80%, transparent))",
          }}
        >
          <nav
            className="grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:gap-2"
            aria-label={t("pages.profile.navigationLabel")}
          >
            {profileNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-foreground/70 hover:text-foreground focus-visible:ring-primary/70 flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-xl border border-transparent px-1.5 text-center text-xs font-semibold transition-[background,border-color,color,box-shadow] duration-200 hover:border-primary/20 hover:bg-primary/8 focus-visible:ring-2 focus-visible:outline-none sm:gap-2 sm:px-4 sm:text-sm",
                    isActive &&
                      "border-primary/30 bg-primary/15 text-foreground hover:border-primary/40 hover:bg-primary/20 shadow-[inset_0_1px_0_rgb(255_255_255_/_12%)]",
                  )
                }
              >
                <item.icon
                  aria-hidden="true"
                  className="hidden size-4 shrink-0 sm:block"
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
