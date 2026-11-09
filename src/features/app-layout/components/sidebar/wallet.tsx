import { ArrowUpLeft } from "lucide-react";

import { CreditIcon } from "./menu-icons";
import { IconTile } from "./sidebar-parts";
import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";
import { formatTokenAmount } from "@/shared/utils";

type AppLayoutSidebarWalletProps = {
  balanceUsdmicro: number;
  onOpenWalletCharge: () => void;
};

function AppLayoutSidebarWallet({
  balanceUsdmicro,
  onOpenWalletCharge,
}: AppLayoutSidebarWalletProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
    <section
      className="border-primary/20 from-foreground/9 to-foreground/3 text-foreground after:bg-primary/13 relative overflow-hidden rounded-3xl border bg-linear-135 to-60% p-4 shadow-[inset_0_1px_rgb(255_255_255/17%),0_14px_30px_rgb(0_0_0/15%)] backdrop-blur-lg after:pointer-events-none after:absolute after:start-1/5 after:-end-1/4 after:-bottom-4/5 after:h-36 after:rounded-full after:blur-[34px] after:content-['']"
      aria-label={t("pages.app.layout.sidebar.balanceCard.title")}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="text-muted-foreground text-xs font-semibold">
          {t("pages.app.layout.sidebar.balanceCard.title")}
        </span>
        <IconTile className="border-primary/20 bg-primary/10 text-primary [&_.icon-accent]:stroke-accent-sky size-8 rounded-lg">
          <CreditIcon />
        </IconTile>
      </div>
      <div className="mt-2 mb-4 flex items-baseline gap-1.5 text-3xl leading-tight font-bold tracking-tighter tabular-nums">
        <span dir="ltr">{formatTokenAmount(balanceUsdmicro)}</span>
        <small className="text-muted-foreground text-xs font-medium tracking-normal">
          {t("common.token")}
        </small>
      </div>
      <Button
        variant="outline"
        className="border-primary/25 from-primary/20 to-primary/8 text-foreground hover-capable:hover:bg-primary/15 hover-capable:hover:[&_svg]:-translate-x-0.5 hover-capable:hover:[&_svg]:-translate-y-0.5 relative z-1 w-full justify-between gap-2 rounded-xl bg-linear-110 px-3 text-xs font-bold [&_svg]:transition-transform motion-reduce:[&_svg]:transition-none"
        onClick={onOpenWalletCharge}
      >
        <span>
          {t("pages.app.layout.sidebar.balanceCard.chargeWallet.title")}
        </span>
        <ArrowUpLeft aria-hidden="true" size={16} />
      </Button>
    </section>
  );
}

export default AppLayoutSidebarWallet;
