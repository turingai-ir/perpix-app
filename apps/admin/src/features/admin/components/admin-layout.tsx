import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  ShieldCheck,
  Users,
  CreditCard,
  Wallet,
  ArrowLeftRight,
  TrendingUp,
  Sparkles,
  Package,
  Percent,
  History,
  Bot,
  Cpu,
  Boxes,
  Server,
  Files,
  Captions,
  Shield,
  KeyRound,
  ShieldAlert,
  X,
  type LucideIcon,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "@/features/auth/session";
import { Button } from "@/components/ui/button";
import { useAppTranslate } from "@/hooks";
import { APP_ROUTES_KEY } from "@/router/routes";

interface NavGroup {
  sectionKey?: string;
  items: readonly {
    path: string;
    label: string;
    icon: LucideIcon;
  }[];
}

const navGroups: readonly NavGroup[] = [
  {
    items: [
      {
        path: APP_ROUTES_KEY.overview.path,
        label: "overview.title",
        icon: LayoutDashboard,
      },
      {
        path: APP_ROUTES_KEY.users.list.path,
        label: "features.users.menuTitle",
        icon: Users,
      },
    ],
  },
  {
    sectionKey: "features.finance.menuSection",
    items: [
      {
        path: APP_ROUTES_KEY.finance.payments.list.path,
        label: "features.finance.payments.menuTitle",
        icon: CreditCard,
      },
      {
        path: APP_ROUTES_KEY.finance.wallets.list.path,
        label: "features.finance.wallets.menuTitle",
        icon: Wallet,
      },
      {
        path: APP_ROUTES_KEY.finance.transactions.path,
        label: "features.finance.transactions.menuTitle",
        icon: ArrowLeftRight,
      },
      {
        path: APP_ROUTES_KEY.finance.topupPolicy.path,
        label: "features.finance.topupPolicy.menuTitle",
        icon: Percent,
      },
      {
        path: APP_ROUTES_KEY.finance.exchangeRate.path,
        label: "features.finance.exchangeRate.menuTitle",
        icon: TrendingUp,
      },
    ],
  },
  {
    sectionKey: "features.subscriptions.menuSection",
    items: [
      {
        path: APP_ROUTES_KEY.subscriptions.list.path,
        label: "features.subscriptions.menuTitle",
        icon: Sparkles,
      },
      {
        path: APP_ROUTES_KEY.subscriptions.plans.path,
        label: "features.subscriptions.plans.menuTitle",
        icon: Package,
      },
      {
        path: APP_ROUTES_KEY.subscriptions.operations.path,
        label: "features.subscriptions.operations.menuTitle",
        icon: History,
      },
    ],
  },
  {
    sectionKey: "features.ai.menuSection",
    items: [
      {
        path: APP_ROUTES_KEY.ai.tasks.list.path,
        label: "features.ai.tasks.menuTitle",
        icon: Bot,
      },
      {
        path: APP_ROUTES_KEY.ai.gateway.list.path,
        label: "features.ai.gateway.menuTitle",
        icon: Cpu,
      },
      {
        path: APP_ROUTES_KEY.ai.models.path,
        label: "features.ai.models.menuTitle",
        icon: Boxes,
      },
      {
        path: APP_ROUTES_KEY.ai.providers.path,
        label: "features.ai.providers.menuTitle",
        icon: Server,
      },
    ],
  },
  {
    sectionKey: "features.studio.menuSection",
    items: [
      {
        path: APP_ROUTES_KEY.studio.captionPresets.path,
        label: "features.studio.captionPresets.menuTitle",
        icon: Captions,
      },
    ],
  },
  {
    sectionKey: "features.files.menuSection",
    items: [
      {
        path: APP_ROUTES_KEY.files.list.path,
        label: "features.files.menuTitle",
        icon: Files,
      },
    ],
  },
  {
    sectionKey: "features.security.menuSection",
    items: [
      {
        path: APP_ROUTES_KEY.security.sessions.path,
        label: "features.security.sessions.menuTitle",
        icon: Shield,
      },
      {
        path: APP_ROUTES_KEY.security.tokens.path,
        label: "features.security.tokens.menuTitle",
        icon: KeyRound,
      },
      {
        path: APP_ROUTES_KEY.security.audit.path,
        label: "features.security.audit.menuTitle",
        icon: ShieldAlert,
      },
    ],
  },
  {
    sectionKey: "navigation.tools",
    items: [
      {
        path: APP_ROUTES_KEY.smsTest.path,
        label: "smsTest.title",
        icon: MessageSquareText,
      },
    ],
  },
] as const;

export function AdminLayout() {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const logout = useMutation({ mutationFn: signOut, networkMode: "always" });

  return (
    <div dir="rtl" className="bg-muted/30 text-foreground min-h-svh lg:flex">
      <header className="border-border bg-card flex items-center justify-between border-b p-4 lg:hidden">
        <span className="font-bold">{t("overview.brand")}</span>
        <Button
          variant="outline"
          size="icon"
          aria-label={t("navigation.toggle")}
          aria-expanded={open}
          aria-controls="admin-sidebar"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </Button>
      </header>
      <aside
        id="admin-sidebar"
        className={`border-border bg-card top-0 flex-col border-b p-5 lg:sticky lg:flex lg:h-svh lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-l ${open ? "flex" : "hidden"}`}
      >
        <div className="mb-6 flex items-center gap-3">
          <span className="bg-primary text-primary-foreground flex size-10 items-center justify-center rounded-xl shadow-xs">
            <ShieldCheck aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="font-bold">{t("overview.brand")}</p>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {t("overview.admin")}
            </p>
          </div>
        </div>

        <nav aria-label={t("navigation.main")} className="space-y-5">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="space-y-1.5">
              {group.sectionKey && (
                <p className="text-muted-foreground px-3 text-[11px] font-semibold tracking-wider uppercase">
                  {t(group.sectionKey, { defaultValue: group.sectionKey })}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map(({ path, label, icon: Icon }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${isActive ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`
                    }
                  >
                    <Icon aria-hidden="true" className="size-4.5 shrink-0" />
                    <span>{t(label, { defaultValue: label })}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-border mt-6 border-t pt-4 lg:mt-auto">
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 w-full cursor-pointer justify-start"
            disabled={logout.isPending}
            onClick={() => logout.mutate()}
          >
            <LogOut aria-hidden="true" className="size-4" />
            {t("overview.logout")}
          </Button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}
