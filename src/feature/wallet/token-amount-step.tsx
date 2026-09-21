import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, LoaderCircle, WalletCards } from "lucide-react";
import { NumericFormat } from "react-number-format";
import z from "zod";

import { Button } from "@/components/ui/button";
import { DialogDescription, DialogTitle } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { formatLocalizedNumber } from "@/utils";

const PRESET_AMOUNTS = [100, 500, 1_000, 5_000] as const;

type TokenAmountStepProps = {
  balance: number;
  initialAmount: string;
  isError: boolean;
  isPending: boolean;
  onRetry: () => void;
  onSubmit: (amount: string) => Promise<void>;
};

export function TokenAmountStep(props: TokenAmountStepProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const schema = z.object({
    amount: z.string().refine((value) => {
      const amount = Number(value);
      return Number.isInteger(amount) && amount >= 10 && amount <= 1_000_000;
    }, t("pages.app.layout.sidebar.balanceCard.chargeWallet.amountError")),
  });
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { amount: props.initialAmount },
    mode: "onBlur",
  });
  const selectedAmount = useWatch({ control: form.control, name: "amount" });

  return (
    <Form {...form}>
      <form
        className="space-y-6"
        onSubmit={form.handleSubmit(({ amount }) => props.onSubmit(amount))}
      >
        <header className="pe-12">
          <div className="bg-primary/12 text-primary mb-4 flex size-11 items-center justify-center rounded-2xl">
            <WalletCards aria-hidden="true" className="size-5" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            {t("pages.app.layout.sidebar.balanceCard.chargeWallet.title")}
          </DialogTitle>
          <DialogDescription className="mt-2 leading-6">
            {t(
              "pages.app.layout.sidebar.balanceCard.chargeWallet.amountDescription",
            )}
          </DialogDescription>
        </header>
        <div className="bg-muted/30 rounded-2xl border px-4 py-3 text-sm">
          <span className="text-muted-foreground">
            {t(
              "pages.app.layout.sidebar.balanceCard.chargeWallet.currentBalance",
            )}
          </span>{" "}
          <strong className="text-foreground tabular-nums">
            {formatLocalizedNumber({ value: props.balance })}{" "}
            {t("common.token")}
          </strong>
        </div>
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t(
                  "pages.app.layout.sidebar.balanceCard.chargeWallet.amountLabel",
                )}
              </FormLabel>
              <FormControl>
                <NumericFormat
                  {...field}
                  customInput={Input}
                  dir="ltr"
                  inputMode="numeric"
                  thousandSeparator=","
                  autoComplete="off"
                  className="h-12 px-4 text-base! tabular-nums"
                  onValueChange={({ value }) => field.onChange(value)}
                />
              </FormControl>
              <p className="text-muted-foreground text-xs">
                {t(
                  "pages.app.layout.sidebar.balanceCard.chargeWallet.amountHelper",
                )}
              </p>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {PRESET_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              type="button"
              variant={
                selectedAmount === String(amount) ? "secondary" : "outline"
              }
              className="h-11 transition-transform duration-150 active:scale-[0.97]"
              onClick={() =>
                form.setValue("amount", String(amount), {
                  shouldValidate: true,
                })
              }
            >
              {formatLocalizedNumber({ value: amount })} {t("common.token")}
            </Button>
          ))}
        </div>
        {props.isError ? (
          <div
            role="alert"
            className="border-destructive/30 bg-destructive/10 text-destructive flex gap-3 rounded-xl border p-3"
          >
            <AlertCircle
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0"
            />
            <div>
              <p className="font-medium">
                {t(
                  "pages.app.layout.sidebar.balanceCard.chargeWallet.errorTitle",
                )}
              </p>
              <button
                type="submit"
                className="mt-1 underline underline-offset-4"
                onClick={props.onRetry}
              >
                {t("pages.app.layout.sidebar.balanceCard.chargeWallet.retry")}
              </button>
            </div>
          </div>
        ) : null}
        <Button
          type="submit"
          className="h-12 w-full text-sm font-semibold transition-transform duration-150 active:scale-[0.98]"
          disabled={props.isPending}
        >
          {props.isPending ? (
            <>
              <LoaderCircle aria-hidden="true" className="animate-spin" />
              {t("pages.app.layout.sidebar.balanceCard.chargeWallet.loading")}
            </>
          ) : (
            t("pages.app.layout.sidebar.balanceCard.chargeWallet.reviewAction")
          )}
        </Button>
      </form>
    </Form>
  );
}
