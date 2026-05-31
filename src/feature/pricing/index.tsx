import { CircleCheck, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAppTranslate } from "@/hook";
import { useReactQueryApi } from "@/hook/app";
import LoadingSection from "@/components/custom/loading-section";
import ErrorSection from "@/components/custom/error-section";
import {
  PaymentGateWayProviderEnumMap,
  type SchemaSubscriptionPlanListResponse,
} from "@/services/api";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const normalizeList = <T,>(value: unknown): T[] => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? [...value] : Array.from(value as ArrayLike<T>);
};

function PricingFeature({ open, onOpenChange }: Props) {
  const reactQueryApi = useReactQueryApi();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const plansQuery = reactQueryApi.useQuery("get", "/user/subscription/plans");
  const userInfoQuery = reactQueryApi.useQuery("get", "/user/get-info");

  const purchasePlanQuery = reactQueryApi.useMutation(
    "post",
    "/user/subscription/purchase",
  );

  const planItems = normalizeList<
    SchemaSubscriptionPlanListResponse["items"][number]
  >(plansQuery.data?.items);
  const plans = planItems.filter(
    (plan) => plan.uuid !== userInfoQuery.data?.active_subscription?.plan.uuid,
  );

  const handlePurchasePlan = async (planId: string) => {
    return await purchasePlanQuery.mutateAsync({
      body: {
        plan_uuid: planId,
        gateway: PaymentGateWayProviderEnumMap.PAYPING_IRR,
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full h-dvh flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-center text-4xl">
            {t("features.pricing.title")}
          </SheetTitle>
          <SheetDescription className="text-center text-lg">
            {t("features.pricing.description")}
          </SheetDescription>
        </SheetHeader>

        {plansQuery.isLoading && <LoadingSection />}
        {plansQuery.isError && (
          <ErrorSection onRetry={() => plansQuery.refetch()} />
        )}

        {plansQuery.isSuccess && (
          <div className="flex-1 overflow-y-auto pt-8 px-6 flex items-center-safe">
            <div className="max-w-(--breakpoint-lg) mx-auto flex flex-col lg:flex-row lg:gap-8 gap-4">
              {plans?.map((plan) => (
                <div
                  key={plan?.name}
                  className={cn("border rounded-lg p-6 flex flex-col w-80", {
                    "border-foreground": plan?.is_recommended,
                  })}
                >
                  <h3 className="text-lg font-medium">{plan?.display_name}</h3>
                  <p className="mt-2 text-4xl font-bold">{`${formatLocalizedNumber({ value: rialToToman(plan?.price_irr ?? 0) })} ${t("common.tomans")}`}</p>
                  <p className="mt-4 font-medium text-muted-foreground">
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
                          <CircleCheck className="h-4 w-4 mt-1 text-green-500" />
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
                      disabled={purchasePlanQuery.isPending}
                      onClick={async () => {
                        const res = await handlePurchasePlan(plan?.uuid ?? "");
                        if (res.gateway_url) {
                          window.location.href = res.gateway_url;
                        }
                      }}
                    >
                      {purchasePlanQuery.isPending &&
                      purchasePlanQuery.variables?.body.plan_uuid ===
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
        )}
      </SheetContent>
    </Sheet>
  );
}

export default PricingFeature;
