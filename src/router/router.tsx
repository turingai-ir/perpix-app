import { useEffect, type ComponentType } from "react";
import { createBrowserRouter, redirect, useRouteError } from "react-router";

import { APP_ROUTES_KEY } from "./routes";
import { loadRouteModule } from "./dynamic-import-recovery";

import RootLayout from "@/pages/(root)/layout";
import { cookies } from "@/utils/cookies";
import { APP_KEYS } from "@/utils";
import { ErrorFallbackPage } from "@/components/custom/error-boundary";
import LoadingSection from "@/components/custom/loading-section";
import { captureError } from "@/lib/observability";

const lazyRoute = (
  importRouteModule: () => Promise<{ default: ComponentType }>,
) => {
  return async () => {
    const routeModule = await loadRouteModule(importRouteModule);
    return { Component: routeModule.default };
  };
};

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    errorElement: <RouteErrorFallback />,
    hydrateFallbackElement: <LoadingSection />,
    children: [
      {
        path: APP_ROUTES_KEY.app.path,
        lazy: lazyRoute(() => import("@/pages/(app)/_layout")),
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
            lazy: lazyRoute(() => import("@/pages/(app)/page")),
            handle: {
              title: APP_ROUTES_KEY.app.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.gallery.path,
            lazy: lazyRoute(() => import("@/pages/(app)/gallery/page")),
            handle: {
              title: APP_ROUTES_KEY.gallery.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.generation.image.path,
            children: [
              {
                index: true,
                lazy: lazyRoute(
                  () => import("@/pages/(app)/generation/image/page"),
                ),
                handle: {
                  title: APP_ROUTES_KEY.generation.image.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.image.history.path,
                lazy: lazyRoute(
                  () => import("@/pages/(app)/generation/image/page"),
                ),
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
                lazy: lazyRoute(
                  () => import("@/pages/(app)/generation/video/page"),
                ),
                handle: {
                  title: APP_ROUTES_KEY.generation.video.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.video.history.path,
                lazy: lazyRoute(
                  () => import("@/pages/(app)/generation/video/page"),
                ),
                handle: {
                  title: APP_ROUTES_KEY.generation.video.history.meta.title,
                },
              },
            ],
          },
          {
            path: APP_ROUTES_KEY.profile.root.path,
            lazy: lazyRoute(() => import("@/pages/profile/layout")),
            children: [
              {
                index: true,
                loader: () => redirect(APP_ROUTES_KEY.profile.settings.path),
              },
              {
                path: APP_ROUTES_KEY.profile.settings.path,
                lazy: lazyRoute(() => import("@/pages/profile/settings/page")),
                handle: {
                  title: APP_ROUTES_KEY.profile.settings.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.payments.path,
                lazy: lazyRoute(() => import("@/pages/profile/payments/page")),
                handle: {
                  title: APP_ROUTES_KEY.profile.payments.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.walletTransactions.path,
                lazy: lazyRoute(
                  () => import("@/pages/profile/wallet-transactions/page"),
                ),
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
            lazy: lazyRoute(() => import("@/pages/editor/page")),
          },
          {
            path: ":fileUuid",
            lazy: lazyRoute(() => import("@/pages/editor/page")),
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
        lazy: lazyRoute(() => import("@/pages/auth/login/page")),
        handle: {
          title: APP_ROUTES_KEY.auth.login.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.payment.result.path,
        lazy: lazyRoute(() => import("@/pages/payment/result/page")),
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
