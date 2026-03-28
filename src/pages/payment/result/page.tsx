import { Link, useParams } from 'react-router';
import { Check } from 'lucide-react';

import { useReactQueryApi } from '@/hook/app';
import LoadingSection from '@/components/custom/loading-section';
import ErrorSection from '@/components/custom/error-section';
import { PaymentInvoiceStatusEnumMap } from '@/services/api';
import { Button } from '@/components/ui/button';
import { formatLocalizedNumber, rialToToman } from '@/utils';
import { useAppTranslate } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';
import { APP_ROUTES_KEY } from '@/router';

function PaymentResultPage() {
  const reactQueryApi = useReactQueryApi();
  const params = useParams();
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const paymentResultQuery = reactQueryApi.useQuery(
    'get',
    '/gateway/payment-result',
    {
      params: { query: { session_id: params?.sessionId ?? '' } },
    },
    { enabled: !!params?.sessionId },
  );

  return (
    <div className="h-dvh w-full">
      {paymentResultQuery.isLoading ? (
        <div className="w-full h-full flex justify-center items-center">
          <LoadingSection />
        </div>
      ) : null}
      {paymentResultQuery.isError ? (
        <div className="w-full h-full flex justify-center items-center">
          <ErrorSection onRetry={() => paymentResultQuery.refetch()} />
        </div>
      ) : null}
      {paymentResultQuery.data &&
      paymentResultQuery.data.transaction_status === PaymentInvoiceStatusEnumMap.PAID ? (
        <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-background">
          <div className="w-full max-w-lg">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 dark:bg-green-400/10 rounded-full blur-xl" />
                <div className="relative bg-linear-to-br from-green-50 to-green-100 dark:from-green-950/40 dark:to-green-900/20 rounded-full p-6 flex items-center justify-center">
                  <Check className="w-12 h-12 text-green-500 dark:text-green-400 stroke-3" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t('pages.payment.result.successful.title')}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t('pages.payment.result.successful.description')}
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
              <div className="flex justify-between items-start gap-4 flex-col lg:flex-row">
                <span className="text-sm text-muted-foreground">
                  {t('pages.payment.result.trackingCode')}
                </span>
                <span dir="ltr" className=" font-mono font-semibold text-foreground">
                  {params.sessionId ?? ''}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-start gap-4 flex-col lg:flex-row">
                <span className="text-sm text-muted-foreground">
                  {t('pages.payment.result.amount')}
                </span>
                <span className="text-2xl font-bold text-green-500 dark:text-green-400">
                  {`${formatLocalizedNumber({
                    value: rialToToman(paymentResultQuery?.data?.total_transaction_amount ?? 0),
                  })} ${t('common.tomans')}`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to={APP_ROUTES_KEY.app.path}>
                <Button className="w-full h-11 bg-green-500 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700 text-white font-semibold transition-colors">
                  {t('pages.payment.result.return')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}{' '}
      {paymentResultQuery.data &&
      paymentResultQuery.data.transaction_status !== PaymentInvoiceStatusEnumMap.PAID ? (
        <div className="flex items-center justify-center min-h-screen px-4 py-8 bg-background">
          <div className="w-full max-w-lg">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-red-500/20 dark:bg-red-400/10 rounded-full blur-xl" />
                <div className="relative bg-linear-to-br from-red-50 to-red-100 dark:from-red-950/40 dark:to-red-900/20 rounded-full p-6 flex items-center justify-center">
                  <Check className="w-12 h-12 text-red-500 dark:text-red-400 stroke-3" />
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                {t('pages.payment.result.failed.title')}
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t('pages.payment.result.failed.description')}
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-card border border-border rounded-xl p-6 mb-8 space-y-4">
              <div className="flex justify-between items-start gap-4 flex-col lg:flex-row">
                <span className="text-sm text-muted-foreground">
                  {t('pages.payment.result.trackingCode')}
                </span>
                <span dir="ltr" className=" font-mono font-semibold text-foreground">
                  {params.sessionId ?? ''}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-start gap-4 flex-col lg:flex-row">
                <span className="text-sm text-muted-foreground">
                  {t('pages.payment.result.amount')}
                </span>
                <span className="text-2xl font-bold text-red-500 dark:text-red-400">
                  {`${formatLocalizedNumber({
                    value: rialToToman(paymentResultQuery?.data?.total_transaction_amount ?? 0),
                  })} ${t('common.tomans')}`}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to={APP_ROUTES_KEY.app.path}>
                <Button className="w-full h-11 bg-red-500 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700 text-white font-semibold transition-colors">
                  {t('pages.payment.result.return')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PaymentResultPage;
