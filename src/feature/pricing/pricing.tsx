import { useCallback, useMemo } from "react";
import { useAtomValue } from "jotai";
import { CircleCheck, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppTranslate } from "@/hooks";
import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import { type SchemaSubscriptionPlanListResponse } from "@/services/api";
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
} from "./api";
import { usePaymentRedirect } from "@/feature/payment";
import { usePricingFeature } from "./hook";
import { pricingFeatureAtom } from "./state";
import PricingPlanPrice from "./pricing-plan-price";

const normalizeList = <T,>(value: unknown): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? [...value] : Array.from(value as ArrayLike<T>);
};

function PricingFeature() {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const { open, requiredModelNames, requiredScopes } =
    useAtomValue(pricingFeatureAtom);
  const { openPricingFeature, closePricingFeature } = usePricingFeature();

  const plansState = useSubscriptionPlans(open);
  const activeSubscriptionState = useActiveSubscription(open);
  const purchaseSubscriptionState = usePurchaseSubscription();
  const { mutateAsync: purchasePlan } = purchaseSubscriptionState;
  const { openPaymentUrl } = usePaymentRedirect();

  const planItems = useMemo(
    () =>
      normalizeList<SchemaSubscriptionPlanListResponse["items"][number]>(
        plansState.data?.items,
      ),
    [plansState.data?.items],
  );

  const plans = useMemo(() => {
    return planItems.filter(
      (plan) =>
        plan.uuid !== activeSubscriptionState.data?.plan.uuid &&
        plan.is_default !== true &&
        requiredScopes.every((scope) => plan.scopes.includes(scope)) &&
        (!requiredModelNames.length ||
          requiredModelNames.some((modelName) =>
            plan.allowed_models.includes(modelName),
          )),
    );
  }, [
    activeSubscriptionState.data?.plan.uuid,
    planItems,
    requiredModelNames,
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

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        openPricingFeature({ requiredModelNames, requiredScopes });
        return;
      }

      closePricingFeature();
    },
    [
      closePricingFeature,
      openPricingFeature,
      requiredModelNames,
      requiredScopes,
    ],
  );

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        className="flex !h-dvh w-full flex-col overflow-hidden"
      >
        <SheetHeader className="p-4 sm:p-6">
          <SheetTitle className="text-center text-2xl sm:text-4xl">
            {t("features.pricing.title")}
          </SheetTitle>
          <SheetDescription className="text-center text-base sm:text-lg">
            {t("features.pricing.description")}
          </SheetDescription>
        </SheetHeader>

        {open && plansState.isLoading && <LoadingSection />}
        {open && plansState.isError && (
          <ErrorSection onRetry={() => plansState.refetch()} />
        )}

        {open && plansState.isSuccess ? (
          <ScrollArea
            className="h-0 min-h-0 flex-1 overflow-hidden"
            viewportClassName="h-full touch-pan-y overscroll-contain"
          >
            <div className="mx-auto flex w-full max-w-(--breakpoint-lg) flex-col gap-4 px-4 pt-4 sm:px-6 sm:pt-8 lg:flex-row lg:gap-8">
              {plans?.map((plan) => (
                <div
                  key={plan?.name}
                  className={cn(
                    "bg-card flex w-full max-w-none flex-col rounded-xl border p-4 shadow-sm transition-shadow hover:shadow-md sm:max-w-80 sm:rounded-2xl sm:p-6",
                    {
                      "border-primary ring-primary/25 ring-1":
                        plan?.is_recommended,
                    },
                  )}
                >
                  <h3 className="text-lg font-medium">{plan?.display_name}</h3>
                  <PricingPlanPrice
                    basePriceIrr={plan.base_price_irr ?? 0}
                    discountedPriceIrr={
                      plan.discounted_price_irr ?? plan.base_price_irr ?? 0
                    }
                  />
                  <p className="text-muted-foreground mt-3 font-medium sm:mt-4">
                    {plan?.description}
                  </p>

                  <Separator className="my-3 sm:my-4" />

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

                  <div className="mt-auto pt-5 sm:pt-7">
                    <Button
                      type="button"
                      variant={plan?.is_recommended ? "default" : "outline"}
                      size="lg"
                      className="w-full"
                      disabled={purchaseSubscriptionState.isPending}
                      onClick={async () => {
                        const res = await handlePurchasePlan(plan?.uuid ?? "");
                        openPaymentUrl({
                          paymentUrl: res.payment_url,
                          amountIrrWithoutTax: res.amount_irr_without_tax,
                          taxPercent: res.tax_percent,
                          taxAmountIrr: res.tax_amount_irr,
                          totalAmountIrr: res.total_amount_irr,
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
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

export default PricingFeature;
