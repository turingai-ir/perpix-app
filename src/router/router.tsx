import { useEffect } from "react";
import { createBrowserRouter, redirect, useRouteError } from "react-router";

import { APP_ROUTES_KEY } from "./routes";

import RootLayout from "@/pages/(root)/layout";
import AppLayout from "@/pages/(app)/_layout";
import AppPage from "@/pages/(app)/page";
import GenerationImagePage from "@/pages/(app)/generation/image/page";
import GenerationVideoPage from "@/pages/(app)/generation/video/page";
import AuthLoginPage from "@/pages/auth/login/page";
import ProfileLayout from "@/pages/profile/layout";
import ProfileSettingsPage from "@/pages/profile/settings/page";
import PaymentResultPage from "@/pages/payment/result/page";
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
          },
          {
            path: APP_ROUTES_KEY.generation.image.path,
            children: [
              {
                index: true,
                Component: GenerationImagePage,
              },
              {
                path: APP_ROUTES_KEY.generation.image.history.path,
                Component: GenerationImagePage,
              },
            ],
          },
          {
            path: APP_ROUTES_KEY.generation.video.path,
            children: [
              {
                index: true,
                Component: GenerationVideoPage,
              },
              {
                path: APP_ROUTES_KEY.generation.video.history.path,
                Component: GenerationVideoPage,
              },
            ],
          },
        ],
      },
      {
        path: APP_ROUTES_KEY.auth.login.path,
        Component: AuthLoginPage,
      },
      {
        path: APP_ROUTES_KEY.profile.root.path,
        Component: ProfileLayout,
        loader: () => {
          const token = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN);
          if (!token) {
            throw redirect(APP_ROUTES_KEY.auth.login.path);
          }

          return null;
        },
        children: [
          {
            path: APP_ROUTES_KEY.profile.settings.path,
            Component: ProfileSettingsPage,
          },
        ],
      },
      {
        path: APP_ROUTES_KEY.payment.result.path,
        Component: PaymentResultPage,
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
