import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatTokenAmount } from "@/utils";

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
    <Card className="text-sidebar-foreground overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045] shadow-[inset_0_1px_rgb(255_255_255/0.09),0_12px_32px_rgb(0_0_0/0.1)] backdrop-blur-xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-2">
          <CardTitle className="text-sm font-medium">
            <Muted>{t("pages.app.layout.sidebar.balanceCard.title")}</Muted>
          </CardTitle>
          <div className="flex items-center gap-1">
            <div className="text-sidebar-foreground text-2xl font-bold tracking-[-0.03em]">
              {formatTokenAmount(balanceUsdmicro)}
            </div>
            <small>{t("common.token")}</small>
          </div>
          <Button
            className="h-auto p-0 transition-transform duration-150 active:scale-[0.97]"
            variant="link"
            onClick={onOpenWalletCharge}
          >
            {t("pages.app.layout.sidebar.balanceCard.chargeWallet.title")}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}

export default AppLayoutSidebarWallet;
