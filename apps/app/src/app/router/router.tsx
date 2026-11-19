import { useEffect, type ComponentType } from "react";
import {
  createBrowserRouter,
  redirect,
  useRouteError,
  type LoaderFunctionArgs,
} from "react-router";

import { APP_ROUTES_KEY } from "./routes";

import RootLayout from "@/pages/(root)/layout";
import { AppLayout } from "@/features/app-layout";
import HomePage from "@/pages/(app)/page";
import GalleryPage from "@/pages/(app)/gallery/page";
import ImageGenerationPage from "@/pages/(app)/generation/image/page";
import VideoGenerationPage from "@/pages/(app)/generation/video/page";
import ProfileLayout from "@/pages/profile/layout";
import SettingsPage from "@/pages/profile/settings/page";
import PaymentsPage from "@/pages/profile/payments/page";
import WalletTransactionsPage from "@/pages/profile/wallet-transactions/page";
import DesignPreviewPage from "@/pages/design-preview/page";
import EditorPage from "@/pages/editor/page";
import LoginPage from "@/pages/auth/login/page";
import PaymentResultPage from "@/pages/payment/result/page";
import {
  bootstrapSession,
  getLoginPath,
  getPostLoginPath,
} from "@/features/auth";
import { ErrorFallbackPage } from "@/shared/components/error-boundary";
import LoadingSection from "@/shared/components/loading-section";
import { captureError } from "@/shared/lib/observability";

/** A route that loads its page on demand, so the studio stays out of the entry bundle. */
const lazyPage =
  (load: () => Promise<{ default: ComponentType }>) => async () => ({
    Component: (await load()).default,
  });

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
        Component: AppLayout,
        loader: requireSession,
        children: [
          {
            index: true,
            Component: HomePage,
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
                Component: ImageGenerationPage,
                handle: {
                  title: APP_ROUTES_KEY.generation.image.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.image.history.path,
                Component: ImageGenerationPage,
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
                Component: VideoGenerationPage,
                handle: {
                  title: APP_ROUTES_KEY.generation.video.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.video.history.path,
                Component: VideoGenerationPage,
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
                Component: SettingsPage,
                handle: {
                  title: APP_ROUTES_KEY.profile.settings.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.payments.path,
                Component: PaymentsPage,
                handle: {
                  title: APP_ROUTES_KEY.profile.payments.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.walletTransactions.path,
                Component: WalletTransactionsPage,
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
        Component: DesignPreviewPage,
        handle: {
          title: APP_ROUTES_KEY.designPreview.meta.title,
        },
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
        loader: requireSession,
        handle: {
          title: APP_ROUTES_KEY.editor.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.studio.path,
        lazy: lazyPage(() => import("@/pages/studio/layout")),
        loader: requireSession,
        children: [
          {
            lazy: lazyPage(() => import("@/pages/studio/tabs-layout")),
            children: [
              {
                index: true,
                lazy: lazyPage(() => import("@/pages/studio/page")),
                handle: { title: APP_ROUTES_KEY.studio.meta.title },
              },
              {
                path: "styles",
                lazy: lazyPage(() => import("@/pages/studio/styles/page")),
                handle: { title: APP_ROUTES_KEY.studio.styles.meta.title },
              },
            ],
          },
          {
            path: APP_ROUTES_KEY.studio.project.path,
            lazy: lazyPage(() => import("@/pages/studio/project/page")),
            handle: { title: APP_ROUTES_KEY.studio.project.meta.title },
          },
        ],
      },
      {
        path: APP_ROUTES_KEY.auth.login.path,
        Component: LoginPage,
        loader: redirectIfAuthenticated,
        handle: {
          title: APP_ROUTES_KEY.auth.login.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.payment.result.path,
        loader: requireSession,
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
