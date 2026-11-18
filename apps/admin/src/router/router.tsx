import { AdminLayout } from "@/features/admin";
import { SmsTestPage } from "@/features/sms-test";
import { createBrowserRouter, Navigate } from "react-router";

import { APP_ROUTES_KEY } from "./routes";

import { ErrorFallbackPage, LoadingSection } from "@/components/custom";
import RootLayout from "@/pages/(root)/layout";
import { OverviewPage } from "@/features/overview";
import { UsersListPage, UserDetailPage } from "@/features/users";
import {
  PaymentsListPage,
  PaymentDetailPage,
  WalletsListPage,
  WalletDetailPage,
  TransactionsListPage,
  ExchangeRatePage,
  TopupPolicyPage,
} from "@/features/finance";
import {
  SubscriptionsListPage,
  SubscriptionDetailPage,
  PlansListPage,
  SubscriptionOperationsPage,
} from "@/features/subscriptions";
import {
  AiTasksListPage,
  AiTaskDetailPage,
  AiGatewayRequestsListPage,
  AiGatewayRequestDetailPage,
  AiModelsListPage,
  AiModelDetailPage,
  AiProvidersListPage,
} from "@/features/ai";
import { FilesListPage, FileDetailPage } from "@/features/files";
import { CaptionPresetsPage } from "@/features/studio";
import {
  SessionsListPage,
  ApiTokensListPage,
  AuditEventsListPage,
} from "@/features/security";
import { LoginPage, SessionGate } from "@/features/auth";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <ErrorFallbackPage />,
    hydrateFallbackElement: <LoadingSection />,
    children: [
      {
        element: (
          <SessionGate>
            <AdminLayout />
          </SessionGate>
        ),
        children: [
          {
            path: APP_ROUTES_KEY.overview.path,
            element: <OverviewPage />,
            handle: { title: APP_ROUTES_KEY.overview.meta.title },
          },
          {
            path: APP_ROUTES_KEY.users.list.path,
            element: <UsersListPage />,
            handle: { title: APP_ROUTES_KEY.users.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.users.detail.path,
            element: <UserDetailPage />,
            handle: { title: APP_ROUTES_KEY.users.detail.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.payments.list.path,
            element: <PaymentsListPage />,
            handle: { title: APP_ROUTES_KEY.finance.payments.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.payments.detail.path,
            element: <PaymentDetailPage />,
            handle: {
              title: APP_ROUTES_KEY.finance.payments.detail.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.finance.wallets.list.path,
            element: <WalletsListPage />,
            handle: { title: APP_ROUTES_KEY.finance.wallets.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.wallets.detail.path,
            element: <WalletDetailPage />,
            handle: { title: APP_ROUTES_KEY.finance.wallets.detail.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.transactions.path,
            element: <TransactionsListPage />,
            handle: { title: APP_ROUTES_KEY.finance.transactions.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.topupPolicy.path,
            element: <TopupPolicyPage />,
            handle: { title: APP_ROUTES_KEY.finance.topupPolicy.meta.title },
          },
          {
            path: APP_ROUTES_KEY.finance.exchangeRate.path,
            element: <ExchangeRatePage />,
            handle: { title: APP_ROUTES_KEY.finance.exchangeRate.meta.title },
          },
          {
            path: APP_ROUTES_KEY.subscriptions.list.path,
            element: <SubscriptionsListPage />,
            handle: { title: APP_ROUTES_KEY.subscriptions.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.subscriptions.detail.path,
            element: <SubscriptionDetailPage />,
            handle: {
              title: APP_ROUTES_KEY.subscriptions.detail.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.subscriptions.plans.path,
            element: <PlansListPage />,
            handle: { title: APP_ROUTES_KEY.subscriptions.plans.meta.title },
          },
          {
            path: APP_ROUTES_KEY.subscriptions.operations.path,
            element: <SubscriptionOperationsPage />,
            handle: {
              title: APP_ROUTES_KEY.subscriptions.operations.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.studio.captionPresets.path,
            element: <CaptionPresetsPage />,
            handle: { title: APP_ROUTES_KEY.studio.captionPresets.meta.title },
          },
          {
            path: APP_ROUTES_KEY.ai.tasks.list.path,
            element: <AiTasksListPage />,
            handle: { title: APP_ROUTES_KEY.ai.tasks.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.ai.tasks.detail.path,
            element: <AiTaskDetailPage />,
            handle: { title: APP_ROUTES_KEY.ai.tasks.detail.meta.title },
          },
          {
            path: APP_ROUTES_KEY.ai.gateway.list.path,
            element: <AiGatewayRequestsListPage />,
            handle: { title: APP_ROUTES_KEY.ai.gateway.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.ai.gateway.detail.path,
            element: <AiGatewayRequestDetailPage />,
            handle: { title: APP_ROUTES_KEY.ai.gateway.detail.meta.title },
          },
          {
            path: APP_ROUTES_KEY.ai.models.path,
            element: <AiModelsListPage />,
            handle: { title: APP_ROUTES_KEY.ai.models.meta.title },
          },
          {
            path: APP_ROUTES_KEY.ai.modelDetail.path,
            element: <AiModelDetailPage />,
            handle: { title: APP_ROUTES_KEY.ai.modelDetail.meta.title },
          },
          {
            path: APP_ROUTES_KEY.ai.providers.path,
            element: <AiProvidersListPage />,
            handle: { title: APP_ROUTES_KEY.ai.providers.meta.title },
          },
          {
            path: APP_ROUTES_KEY.files.list.path,
            element: <FilesListPage />,
            handle: { title: APP_ROUTES_KEY.files.list.meta.title },
          },
          {
            path: APP_ROUTES_KEY.files.detail.path,
            element: <FileDetailPage />,
            handle: { title: APP_ROUTES_KEY.files.detail.meta.title },
          },
          {
            path: APP_ROUTES_KEY.security.sessions.path,
            element: <SessionsListPage />,
            handle: { title: APP_ROUTES_KEY.security.sessions.meta.title },
          },
          {
            path: APP_ROUTES_KEY.security.tokens.path,
            element: <ApiTokensListPage />,
            handle: { title: APP_ROUTES_KEY.security.tokens.meta.title },
          },
          {
            path: APP_ROUTES_KEY.security.audit.path,
            element: <AuditEventsListPage />,
            handle: { title: APP_ROUTES_KEY.security.audit.meta.title },
          },
          {
            path: APP_ROUTES_KEY.smsTest.path,
            element: <SmsTestPage />,
            handle: { title: APP_ROUTES_KEY.smsTest.meta.title },
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to={APP_ROUTES_KEY.overview.path} replace />,
      },
      {
        path: APP_ROUTES_KEY.auth.login.path,
        element: <LoginPage />,
        handle: {
          title: APP_ROUTES_KEY.auth.login.meta.title,
        },
      },
    ],
  },
]);
