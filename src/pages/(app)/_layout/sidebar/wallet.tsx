import { selectAtom } from "jotai/utils";
import { useAtom } from "jotai";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { LoaderCircle } from "lucide-react";
import { useDebounce } from "react-use";
import { NumericFormat } from "react-number-format";

import appLayoutAtom from "../_state";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import {
  formatLocalizedNumber,
  microDollarToToken,
  rialToToman,
  tokenToMicroDollar,
} from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useReactQueryApi } from "@/hook/app";
import { PaymentGateWayProviderEnumMap } from "@/services/api";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useUser } from "@/pages/_hooks";

function AppLayoutSidebarWallet() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const reactQueryApi = useReactQueryApi();

  const { userState } = useUser();

  const exchangeRateMutation = reactQueryApi.useMutation(
    "get",
    "/gateway/irr-exchange-rate",
  );
  const walletDepositMutation = reactQueryApi.useMutation(
    "post",
    "/user/wallet/deposit",
  );

  const formSchema = z.object({
    amount: z
      .string({
        error: t("common.validationErrors.required", {
          name: t("common.token"),
        }),
      })
      .refine(
        (s) => {
          const n = Number(s);
          return !Number.isNaN(n) && n >= 1_000;
        },
        {
          message: t("common.validationErrors.min", {
            name: t("common.token"),
            min: formatLocalizedNumber({ value: 1_000 }),
          }),
        },
      )
      .refine(
        (s) => {
          const n = Number(s);
          return !Number.isNaN(n) && n <= 1_000_000;
        },
        {
          message: t("common.validationErrors.max", {
            name: t("common.token"),
            max: formatLocalizedNumber({ value: 1_000_000 }),
          }),
        },
      ),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: "",
    },
    mode: "onChange",
  });

  const amountWatch = form.watch("amount");

  useDebounce(
    () => {
      if (amountWatch) {
        exchangeRateMutation.mutate({
          params: {
            query: {
              provider: PaymentGateWayProviderEnumMap.PAYPING_IRR,
              amount_usdmicro: tokenToMicroDollar(parseInt(amountWatch, 10)),
            },
          },
        });
      }
    },
    300,
    [amountWatch],
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await walletDepositMutation.mutateAsync({
      body: {
        amount_usdmicro: tokenToMicroDollar(parseInt(values.amount, 10)),
        gateway: PaymentGateWayProviderEnumMap.PAYPING_IRR,
      },
    });
    if (res.gateway_url) {
      window.location.href = res.gateway_url;
    }
  }

  return (
    <Card className="border-sidebar-border bg-sidebar text-sidebar-foreground border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-2">
          <CardTitle className="text-sm font-medium">
            <Muted>{t("pages.app.layout.sidebar.balanceCard.title")}</Muted>
          </CardTitle>
          <div className="flex items-center gap-1">
            <div className="text-sidebar-foreground text-2xl font-semibold tracking-tight">
              {formatLocalizedNumber({
                value: microDollarToToken(
                  userState.data?.default_wallet?.balance_usdmicro || 0,
                ),
              })}
            </div>
            <small>{t("common.token")}</small>
          </div>
          <Form {...form}>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="p-0!" variant="link">
                  {t("pages.app.layout.sidebar.balanceCard.chargeWallet.title")}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-106.25">
                <DialogHeader className="text-right!">
                  <DialogTitle className="mb-4">
                    {t(
                      "pages.app.layout.sidebar.balanceCard.chargeWallet.title",
                    )}
                  </DialogTitle>
                  <DialogDescription>
                    {t(
                      "pages.app.layout.sidebar.balanceCard.chargeWallet.description",
                    )}
                  </DialogDescription>
                </DialogHeader>

                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>{t("common.token")}</FormLabel>
                        <FormControl>
                          <NumericFormat
                            customInput={Input}
                            dir="ltr"
                            thousandSeparator=","
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.value.replace(/,/g, ""))
                            }
                            autoComplete="off"
                          />
                        </FormControl>
                        {fieldState.error ? <FormMessage /> : null}
                      </FormItem>
                    )}
                  />
                  <Button
                    className="w-full"
                    type="submit"
                    disabled={
                      exchangeRateMutation.isPending ||
                      walletDepositMutation.isPending
                    }
                  >
                    {exchangeRateMutation.isPending ||
                    walletDepositMutation.isPending ? (
                      <LoaderCircle className="animate-spin" />
                    ) : exchangeRateMutation.data?.total_transaction_amount ? (
                      t(
                        "pages.app.layout.sidebar.balanceCard.chargeWallet.action",
                        {
                          amount: formatLocalizedNumber({
                            value: rialToToman(
                              exchangeRateMutation.data
                                ?.total_transaction_amount,
                            ),
                          }),
                        },
                      )
                    ) : (
                      t(
                        "pages.app.layout.sidebar.balanceCard.chargeWallet.nonAction",
                      )
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Form>
        </div>
      </CardHeader>
    </Card>
  );
}

export default AppLayoutSidebarWallet;
