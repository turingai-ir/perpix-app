import type { FC } from "react";
import { CreditCard, History, Settings } from "lucide-react";
import { NavLink, Outlet } from "react-router";

import { APP_ROUTES_KEY } from "@/router/routes";
import { cn } from "@/lib/utils";

const profileNavItems = [
  {
    to: APP_ROUTES_KEY.profile.settings.path,
    label: "تنظیمات",
    icon: Settings,
  },
  {
    to: APP_ROUTES_KEY.profile.payments.path,
    label: "پرداخت‌ها",
    icon: CreditCard,
  },
  {
    to: APP_ROUTES_KEY.profile.walletTransactions.path,
    label: "تراکنش‌های کیف پول",
    icon: History,
  },
];

const ProfileLayout: FC = () => {
  return (
    <div className="bg-background min-h-full w-full">
      <div className="mx-auto flex min-h-full w-full max-w-7xl flex-col px-4 py-4 md:px-6 md:py-6">
        <header className="border-border bg-card/70 sticky top-0 z-10 mb-4 rounded-lg border p-2 backdrop-blur">
          <nav className="flex gap-2 overflow-x-auto">
            {profileNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "text-muted-foreground hover:bg-muted hover:text-foreground flex h-10 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                    isActive &&
                      "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                  )
                }
              >
                <item.icon className="size-4" />
                <span>{item.label}</span>
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
