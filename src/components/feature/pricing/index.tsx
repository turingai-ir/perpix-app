import { CircleCheck, LoaderCircle } from 'lucide-react';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAppTranslate } from '@/hook';
import { useReactQueryApi } from '@/hook/app';
import LoadingSection from '@/components/custom/loading-section';
import ErrorSection from '@/components/custom/error-section';
import {
  PaymentGateWayProviderEnum,
  SubscriptionPlansEnum,
  type SchemaSubscriptionPlanResponse,
} from '@/services/api';
import { formatLocalizedNumber, rialToToman } from '@/utils';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { APP_I18_KEYS } from '@/services/i18';
import { cn } from '@/lib/utils';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
function PricingFeature({ open, onOpenChange }: Props) {
  const reactQueryApi = useReactQueryApi();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const plansQuery = reactQueryApi.useQuery('get', '/user/subscription/plans');

  const purchasePlanQuery = reactQueryApi.useMutation('post', '/user/subscription/purchase');

  const plans = useMemo(() => {
    const planConfigs = {
      [SubscriptionPlansEnum.ECONOMIC]: {
        getName: (plan: SchemaSubscriptionPlanResponse) =>
          t('features.pricing.plans.economic.title') ?? plan.name,
        description: 'features.pricing.plans.economic.description',
        features: 'features.pricing.plans.economic.features',
        isRecommended: false,
        isPopular: false,
      },
      [SubscriptionPlansEnum.BASIC]: {
        getName: (plan: SchemaSubscriptionPlanResponse) =>
          t('features.pricing.plans.basic.title') ?? plan.name,
        description: 'features.pricing.plans.basic.description',
        features: 'features.pricing.plans.basic.features',
        isRecommended: true,
        isPopular: true,
      },
      [SubscriptionPlansEnum.PRO]: {
        getName: (plan: SchemaSubscriptionPlanResponse) =>
          plan.display_name ?? t('features.pricing.plans.pro.title'),
        description: 'features.pricing.plans.pro.description',
        features: 'features.pricing.plans.pro.features',
        isRecommended: false,
        isPopular: false,
      },
    };

    return Array.from(plansQuery.data?.items ?? [])
      .reverse()
      .map((plan) => {
        const config = planConfigs[plan.name as SubscriptionPlansEnum];
        if (!config) {
          return null;
        }

        return {
          name: config.getName(plan),
          price: formatLocalizedNumber({ value: rialToToman(plan.price_irr ?? 0) }),
          description: t(config.description),
          features: t(config.features, { returnObjects: true }) as string[],
          buttonText: t('features.pricing.purchase'),
          isRecommended: config.isRecommended ?? false,
          isPopular: config.isPopular ?? false,
          planId: plan.uuid,
        };
      })
      .filter(Boolean);
  }, [plansQuery.data?.items, t]);

  const handlePurchasePlan = async (planId: string) => {
    return await purchasePlanQuery.mutateAsync({
      body: {
        plan_uuid: planId,
        gateway: PaymentGateWayProviderEnum.PAYPING_IRR,
      },
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="w-full h-dvh flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-center text-4xl">{t('features.pricing.title')}</SheetTitle>
          <SheetDescription className="text-center text-lg">
            {t('features.pricing.description')}
          </SheetDescription>
        </SheetHeader>

        {plansQuery.isLoading && <LoadingSection />}
        {plansQuery.isError && <ErrorSection onRetry={() => plansQuery.refetch()} />}

        {plansQuery.isSuccess && (
          <div className="flex-1 overflow-y-auto pt-8 px-6 flex items-center-safe">
            <div className="max-w-(--breakpoint-lg) mx-auto flex flex-col lg:flex-row lg:gap-8 gap-4">
              {plans?.map((plan) => (
                <div
                  key={plan?.name}
                  className={cn('border rounded-lg p-6 flex flex-col w-72', {
                    'border-foreground': plan?.isRecommended,
                  })}
                >
                  <h3 className="text-lg font-medium">{plan?.name}</h3>
                  <p className="mt-2 text-4xl font-bold">{`${plan?.price} ${t('common.tomans')}`}</p>
                  <p className="mt-4 font-medium text-muted-foreground">{plan?.description}</p>

                  <Separator className="my-4" />

                  <ul className="space-y-2">
                    {(plan?.features ?? []).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <CircleCheck className="h-4 w-4 mt-1 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto pt-7">
                    <Button
                      type="button"
                      variant={plan?.isPopular ? 'default' : 'outline'}
                      size="lg"
                      className="w-full"
                      disabled={purchasePlanQuery.isPending}
                      onClick={async () => {
                        const res = await handlePurchasePlan(plan?.planId ?? '');
                        if (res.gateway_url) {
                          window.location.href = res.gateway_url;
                        }
                      }}
                    >
                      {purchasePlanQuery.isPending &&
                      purchasePlanQuery.variables?.body.plan_uuid === plan?.planId ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        plan?.buttonText
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
