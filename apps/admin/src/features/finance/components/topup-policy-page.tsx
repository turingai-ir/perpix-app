import { useState } from "react";
import { Loader2, Percent } from "lucide-react";

import { DetailPageLayout } from "@/components/custom/detail-page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { UsdmicroInputHint } from "@/components/custom/usdmicro-amount";
import { useAppTranslate } from "@/hooks";
import { useSaveTopupPolicy, useTopupPolicy } from "../hooks/use-topup-policy";
import {
  formToBody,
  policyToForm,
  validateTopupPolicyForm,
  type TopupPolicy,
  type TopupPolicyError,
  type TopupPolicyForm,
} from "../model/topup-policy-form";
import { TopupTiersEditor } from "./topup-tiers-editor";
import { UsdmicroInput } from "@/components/custom/usdmicro-input";

const ERROR_TEXT: Record<TopupPolicyError, string> = {
  profit: "درصد سود باید یک عدد صحیح بین ۰ تا ۱۰۰۰ باشد.",
  limits:
    "کف و سقف شارژ باید عدد صحیح میکرودلار باشند؛ کف از صفر بیشتر و سقف برابر یا بیشتر از کف.",
  firstTier: "اولین لیگ باید از ۰ میکرودلار شروع شود.",
  tierOrder: "شروع لیگ‌ها باید عدد صحیح میکرودلار و صعودی باشد.",
  tierDiscount: "تخفیف هر لیگ باید بین ۰ تا ۱۰۰ باشد و از لیگ قبلی کمتر نشود.",
  tierCount: "تعداد لیگ‌ها باید بین ۱ تا ۲۰ باشد.",
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-foreground text-xs font-semibold">{label}</label>
      {children}
      {hint ? (
        <p className="text-muted-foreground text-[11px]">{hint}</p>
      ) : null}
    </div>
  );
}

function PolicyForm({ initial }: { initial: TopupPolicyForm }) {
  const { t } = useAppTranslate();
  const [form, setForm] = useState(initial);
  const save = useSaveTopupPolicy();
  const errors = validateTopupPolicyForm(form);
  const set = (patch: Partial<TopupPolicyForm>) =>
    setForm((current) => ({ ...current, ...patch }));

  return (
    <form
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        if (errors.length === 0) save.mutate(formToBody(form));
      }}
    >
      <Card>
        <CardHeader className="border-border/60 border-b pb-4">
          <CardTitle className="text-base font-semibold">
            {t("features.finance.topupPolicy.limitsTitle", {
              defaultValue: "سود و بازهٔ مجاز شارژ",
            })}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
          <Field
            label={t("features.finance.topupPolicy.profit", {
              defaultValue: "سود ما روی شارژ (٪)",
            })}
          >
            <Input
              dir="ltr"
              inputMode="numeric"
              value={form.profitPercent}
              onChange={(e) => set({ profitPercent: e.target.value })}
            />
          </Field>
          <Field
            label={t("features.finance.topupPolicy.min", {
              defaultValue: "کف شارژ (میکرودلار)",
            })}
          >
            <UsdmicroInput
              value={form.minUsdmicro}
              onValueChange={(v) => set({ minUsdmicro: v })}
            />
            <UsdmicroInputHint value={form.minUsdmicro} />
          </Field>
          <Field
            label={t("features.finance.topupPolicy.max", {
              defaultValue: "سقف شارژ (میکرودلار)",
            })}
          >
            <UsdmicroInput
              value={form.maxUsdmicro}
              onValueChange={(v) => set({ maxUsdmicro: v })}
            />
            <UsdmicroInputHint value={form.maxUsdmicro} />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-border/60 border-b pb-4">
          <CardTitle className="text-base font-semibold">
            {t("features.finance.topupPolicy.tiersTitle", {
              defaultValue: "لیگ‌های تخفیف",
            })}
          </CardTitle>
          <p className="text-muted-foreground text-xs leading-relaxed">
            {t("features.finance.topupPolicy.tiersHint", {
              defaultValue:
                "تخفیف هر لیگ درصدی از خودِ سود ماست: با سود ۲۰٪ و تخفیف ۲۵٪، سود ما ۱۵٪ می‌شود. تخفیف ۱۰۰٪ یعنی هیچ سودی گرفته نمی‌شود.",
            })}
          </p>
        </CardHeader>
        <CardContent className="p-6">
          <TopupTiersEditor
            tiers={form.tiers}
            profitPercent={form.profitPercent}
            onChange={(tiers) => set({ tiers })}
          />
        </CardContent>
      </Card>

      {errors.length > 0 ? (
        <ul className="text-destructive space-y-1 text-xs" role="alert">
          {errors.map((error) => (
            <li key={error}>{ERROR_TEXT[error]}</li>
          ))}
        </ul>
      ) : null}
      <Button type="submit" disabled={errors.length > 0 || save.isPending}>
        {save.isPending ? <Loader2 className="size-4 animate-spin" /> : null}
        {t("features.finance.topupPolicy.save", {
          defaultValue: "ذخیرهٔ تنظیمات",
        })}
      </Button>
    </form>
  );
}

export function TopupPolicyPage() {
  const { t } = useAppTranslate();
  const { data, isPending, isError, refetch } = useTopupPolicy();

  return (
    <DetailPageLayout
      breadcrumbs={[
        { label: t("features.finance.menuTitle", { defaultValue: "مالی" }) },
        {
          label: t("features.finance.topupPolicy.menuTitle", {
            defaultValue: "تنظیمات شارژ کیف پول",
          }),
        },
      ]}
      title={
        <div className="flex items-center gap-2">
          <Percent className="text-primary size-6" />
          <span>
            {t("features.finance.topupPolicy.menuTitle", {
              defaultValue: "تنظیمات شارژ کیف پول",
            })}
          </span>
        </div>
      }
      isLoading={isPending}
      isError={isError}
      onRetry={() => void refetch()}
    >
      {data ? (
        // Query data is a deep mapped type; narrow it to the schema type.
        <PolicyForm initial={policyToForm(data as TopupPolicy)} />
      ) : null}
    </DetailPageLayout>
  );
}
