import { useEffect } from "react";
import {
  createBrowserRouter,
  redirect,
  useRouteError,
  type LoaderFunctionArgs,
} from "react-router";

import { APP_ROUTES_KEY } from "./routes";

import RootLayout from "@/pages/(root)/layout";
import Route1 from "@/pages/(app)/_layout";
import Route2 from "@/pages/(app)/page";
import Route3 from "@/pages/(app)/gallery/page";
import Route4 from "@/pages/(app)/generation/image/page";
import Route5 from "@/pages/(app)/generation/video/page";
import Route6 from "@/pages/profile/layout";
import Route7 from "@/pages/profile/settings/page";
import Route8 from "@/pages/profile/payments/page";
import Route9 from "@/pages/profile/wallet-transactions/page";
import Route10 from "@/pages/design-preview/page";
import Route11 from "@/pages/editor/page";
import Route12 from "@/pages/auth/login/page";
import Route13 from "@/pages/payment/result/page";
import {
  bootstrapSession,
  getLoginPath,
  getPostLoginPath,
} from "@/features/auth";
import { ErrorFallbackPage } from "@/shared/components/error-boundary";
import LoadingSection from "@/shared/components/loading-section";
import { captureError } from "@/shared/lib/observability";

const requireSession = async ({ request }: LoaderFunctionArgs) => {
  if ((await bootstrapSession()) === "anonymous") {
    const url = new URL(request.url);
    throw redirect(getLoginPath(url.pathname + url.search + url.hash));
  }

  return null;
};

const redirectIfAuthenticated = async ({ request }: LoaderFunctionArgs) => {
  if ((await bootstrapSession()) === "authenticated") {
    throw redirect(getPostLoginPath(new URL(request.url).search));
  }

  return null;
};

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    errorElement: <RouteErrorFallback />,
    hydrateFallbackElement: <LoadingSection />,
    children: [
      {
        path: APP_ROUTES_KEY.app.path,
        Component: Route1,
        loader: requireSession,
        children: [
          {
            index: true,
            Component: Route2,
            handle: {
              title: APP_ROUTES_KEY.app.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.gallery.path,
            Component: Route3,
            handle: {
              title: APP_ROUTES_KEY.gallery.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.generation.image.path,
            children: [
              {
                index: true,
                Component: Route4,
                handle: {
                  title: APP_ROUTES_KEY.generation.image.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.image.history.path,
                Component: Route4,
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
                Component: Route5,
                handle: {
                  title: APP_ROUTES_KEY.generation.video.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.video.history.path,
                Component: Route5,
                handle: {
                  title: APP_ROUTES_KEY.generation.video.history.meta.title,
                },
              },
            ],
          },
          {
            path: APP_ROUTES_KEY.profile.root.path,
            Component: Route6,
            children: [
              {
                index: true,
                loader: () => redirect(APP_ROUTES_KEY.profile.settings.path),
              },
              {
                path: APP_ROUTES_KEY.profile.settings.path,
                Component: Route7,
                handle: {
                  title: APP_ROUTES_KEY.profile.settings.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.payments.path,
                Component: Route8,
                handle: {
                  title: APP_ROUTES_KEY.profile.payments.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.walletTransactions.path,
                Component: Route9,
                handle: {
                  title: APP_ROUTES_KEY.profile.walletTransactions.meta.title,
                },
              },
            ],
          },
        ],
      },
      {
        path: APP_ROUTES_KEY.designPreview.path,
        Component: Route10,
        handle: {
          title: APP_ROUTES_KEY.designPreview.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.editor.path,
        children: [
          {
            index: true,
            Component: Route11,
          },
          {
            path: ":fileUuid",
            Component: Route11,
          },
        ],
        loader: requireSession,
        handle: {
          title: APP_ROUTES_KEY.editor.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.auth.login.path,
        Component: Route12,
        loader: redirectIfAuthenticated,
        handle: {
          title: APP_ROUTES_KEY.auth.login.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.payment.result.path,
        loader: requireSession,
        Component: Route13,
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
