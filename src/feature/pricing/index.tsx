import { Activity, useCallback, useMemo } from "react";
import { CircleCheck, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppTranslate } from "@/hook";
import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import { type SchemaSubscriptionPlanListResponse } from "@/services/api";
import { formatLocalizedNumber, rialToToman } from "@/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { APP_I18_KEYS } from "@/services/i18";
import { cn } from "@/lib/utils";
import { Muted } from "@/components/ui/typography";
import {
  useActiveSubscription,
  usePurchaseSubscription,
  useSubscriptionPlans,
} from "@/pages/_hooks";
import { usePaymentRedirect } from "@/feature/payment";

interface Props {
  open: boolean;
  requiredScopes?: string[];
  onOpenChange: (open: boolean) => void;
}

const normalizeList = <T,>(value: unknown): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? [...value] : Array.from(value as ArrayLike<T>);
};

function PricingFeature({ open, requiredScopes = [], onOpenChange }: Props) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const plansState = useSubscriptionPlans(open);
  const activeSubscriptionState = useActiveSubscription();
  const purchaseSubscriptionState = usePurchaseSubscription();
  const { mutateAsync: purchasePlan } = purchaseSubscriptionState;
  const { openPaymentUrl } = usePaymentRedirect();

  const plans = useMemo(() => {
    const planItems = normalizeList<
      SchemaSubscriptionPlanListResponse["items"][number]
    >(plansState.data?.items);

    return planItems.filter(
      (plan) =>
        plan.uuid !== activeSubscriptionState.data?.plan.uuid &&
        plan.is_default !== true &&
        requiredScopes.every((scope) => plan.scopes.includes(scope)),
    );
  }, [
    activeSubscriptionState.data?.plan.uuid,
    plansState.data?.items,
    requiredScopes,
  ]);

  const handlePurchasePlan = useCallback(
    async (planId: string) => {
      return await purchasePlan({
        body: {
          plan_uuid: planId,
        },
      });
    },
    [purchasePlan],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="flex h-dvh w-full flex-col transition-transform duration-100 ease-out"
      >
        <SheetHeader>
          <SheetTitle className="text-center text-4xl">
            {t("features.pricing.title")}
          </SheetTitle>
          <SheetDescription className="text-center text-lg">
            {t("features.pricing.description")}
          </SheetDescription>
        </SheetHeader>

        {plansState.isLoading && <LoadingSection />}
        {plansState.isError && (
          <ErrorSection onRetry={() => plansState.refetch()} />
        )}

        <Activity mode={plansState.isSuccess ? "visible" : "hidden"}>
          <div className="flex flex-1 items-center-safe overflow-y-auto px-6 pt-8">
            <div className="mx-auto flex max-w-(--breakpoint-lg) flex-col gap-4 lg:flex-row lg:gap-8">
              {plans?.map((plan) => (
                <div
                  key={plan?.name}
                  className={cn("flex w-80 flex-col rounded-lg border p-6", {
                    "border-foreground": plan?.is_recommended,
                  })}
                >
                  <h3 className="text-lg font-medium">{plan?.display_name}</h3>
                  <p className="mt-2 text-4xl font-bold">{`${formatLocalizedNumber({ value: rialToToman(plan?.price_irr ?? 0) })} ${t("common.tomans")}`}</p>
                  <p className="text-muted-foreground mt-4 font-medium">
                    {plan?.description}
                  </p>

                  <Separator className="my-4" />

                  <ul className="space-y-2">
                    {((plan.meta?.features as string[]) ?? []).map(
                      (feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CircleCheck className="mt-1 h-4 w-4 text-green-500" />
                          <Muted> {feature}</Muted>
                        </li>
                      ),
                    )}
                  </ul>

                  <div className="mt-auto pt-7">
                    <Button
                      type="button"
                      variant={plan?.is_popular ? "default" : "outline"}
                      size="lg"
                      className="w-full"
                      disabled={purchaseSubscriptionState.isPending}
                      onClick={async () => {
                        const res = await handlePurchasePlan(plan?.uuid ?? "");
                        openPaymentUrl({
                          paymentUrl: res.payment_url,
                          amountIrr: res.amount_irr,
                        });
                      }}
                    >
                      {purchaseSubscriptionState.isPending &&
                      purchaseSubscriptionState.variables?.body.plan_uuid ===
                        plan?.uuid ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        t("features.pricing.purchase")
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Activity>
      </SheetContent>
    </Sheet>
  );
}

export default PricingFeature;
