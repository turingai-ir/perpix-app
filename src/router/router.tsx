import { useEffect } from "react";
import { createBrowserRouter, redirect, useRouteError } from "react-router";

import { APP_ROUTES_KEY } from "./routes";

import RootLayout from "@/pages/(root)/layout";
import AppLayout from "@/pages/(app)/_layout";
import AppPage from "@/pages/(app)/page";
import GalleryPage from "@/pages/(app)/gallery/page";
import GenerationImagePage from "@/pages/(app)/generation/image/page";
import GenerationVideoPage from "@/pages/(app)/generation/video/page";
import AuthLoginPage from "@/pages/auth/login/page";
import ProfileLayout from "@/pages/profile/layout";
import ProfileSettingsPage from "@/pages/profile/settings/page";
import ProfilePaymentsPage from "@/pages/profile/payments/page";
import ProfileWalletTransactionsPage from "@/pages/profile/wallet-transactions/page";
import PaymentResultPage from "@/pages/payment/result/page";
import EditorPage from "@/pages/editor/page";
import { cookies } from "@/utils/cookies";
import { APP_KEYS } from "@/utils";
import { ErrorFallbackPage } from "@/components/custom/error-boundary";
import { captureError } from "@/lib/observability";

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        path: APP_ROUTES_KEY.app.path,
        Component: AppLayout,
        loader: () => {
          const token = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN);
          if (!token) {
            throw redirect(APP_ROUTES_KEY.auth.login.path);
          }

          return null;
        },
        children: [
          {
            index: true,
            Component: AppPage,
            handle: {
              title: APP_ROUTES_KEY.app.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.gallery.path,
            Component: GalleryPage,
            handle: {
              title: APP_ROUTES_KEY.gallery.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.generation.image.path,
            children: [
              {
                index: true,
                Component: GenerationImagePage,
                handle: {
                  title: APP_ROUTES_KEY.generation.image.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.image.history.path,
                Component: GenerationImagePage,
                handle: {
                  title: APP_ROUTES_KEY.generation.image.history.meta.title,
                },
              },
            ],
          },
          {
            path: APP_ROUTES_KEY.generation.video.path,
            children: [
              {
                index: true,
                Component: GenerationVideoPage,
                handle: {
                  title: APP_ROUTES_KEY.generation.video.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.video.history.path,
                Component: GenerationVideoPage,
                handle: {
                  title: APP_ROUTES_KEY.generation.video.history.meta.title,
                },
              },
            ],
          },
          {
            path: APP_ROUTES_KEY.profile.root.path,
            Component: ProfileLayout,
            children: [
              {
                index: true,
                loader: () => redirect(APP_ROUTES_KEY.profile.settings.path),
              },
              {
                path: APP_ROUTES_KEY.profile.settings.path,
                Component: ProfileSettingsPage,
                handle: {
                  title: APP_ROUTES_KEY.profile.settings.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.payments.path,
                Component: ProfilePaymentsPage,
                handle: {
                  title: APP_ROUTES_KEY.profile.payments.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.walletTransactions.path,
                Component: ProfileWalletTransactionsPage,
                handle: {
                  title: APP_ROUTES_KEY.profile.walletTransactions.meta.title,
                },
              },
            ],
          },
        ],
      },
      {
        path: APP_ROUTES_KEY.editor.path,
        children: [
          {
            index: true,
            Component: EditorPage,
          },
          {
            path: ":fileUuid",
            Component: EditorPage,
          },
        ],
        loader: () => {
          const token = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN);
          if (!token) {
            throw redirect(APP_ROUTES_KEY.auth.login.path);
          }
          return null;
        },
        handle: {
          title: APP_ROUTES_KEY.editor.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.auth.login.path,
        Component: AuthLoginPage,
        handle: {
          title: APP_ROUTES_KEY.auth.login.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.payment.result.path,
        Component: PaymentResultPage,
        handle: {
          title: APP_ROUTES_KEY.payment.result.meta.title,
        },
      },
      {
        path: "*",
        loader: () => redirect(APP_ROUTES_KEY.app.path),
      },
    ],
  },
]);

function RouteErrorFallback() {
  const error = useRouteError();

  useEffect(() => {
    captureError(error);
  }, [error]);

  return <ErrorFallbackPage />;
}
