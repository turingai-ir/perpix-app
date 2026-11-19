import type { ComponentType } from "react";
import {
  createBrowserRouter,
  redirect,
  type LoaderFunctionArgs,
} from "react-router";

import { APP_ROUTES_KEY } from "./routes";
import { RouteErrorFallback } from "./route-error-fallback";

import RootLayout from "@/pages/(root)/layout";
import { AppLayout } from "@/features/app-layout";
import {
  bootstrapSession,
  getLoginPath,
  getPostLoginPath,
} from "@/features/auth";
import LoadingSection from "@/shared/components/loading-section";

/** A route that loads its page on demand, keeping non-initial bundles lean. */
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
            lazy: lazyPage(() => import("@/pages/(app)/page")),
            handle: {
              title: APP_ROUTES_KEY.app.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.gallery.path,
            lazy: lazyPage(() => import("@/pages/(app)/gallery/page")),
            handle: {
              title: APP_ROUTES_KEY.gallery.meta.title,
            },
          },
          {
            path: APP_ROUTES_KEY.generation.image.path,
            children: [
              {
                index: true,
                lazy: lazyPage(
                  () => import("@/pages/(app)/generation/image/page"),
                ),
                handle: {
                  title: APP_ROUTES_KEY.generation.image.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.image.history.path,
                lazy: lazyPage(
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
                lazy: lazyPage(
                  () => import("@/pages/(app)/generation/video/page"),
                ),
                handle: {
                  title: APP_ROUTES_KEY.generation.video.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.generation.video.history.path,
                lazy: lazyPage(
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
            lazy: lazyPage(() => import("@/pages/profile/layout")),
            children: [
              {
                index: true,
                loader: () => redirect(APP_ROUTES_KEY.profile.settings.path),
              },
              {
                path: APP_ROUTES_KEY.profile.settings.path,
                lazy: lazyPage(() => import("@/pages/profile/settings/page")),
                handle: {
                  title: APP_ROUTES_KEY.profile.settings.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.payments.path,
                lazy: lazyPage(() => import("@/pages/profile/payments/page")),
                handle: {
                  title: APP_ROUTES_KEY.profile.payments.meta.title,
                },
              },
              {
                path: APP_ROUTES_KEY.profile.walletTransactions.path,
                lazy: lazyPage(
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
        path: APP_ROUTES_KEY.designPreview.path,
        lazy: lazyPage(() => import("@/pages/design-preview/page")),
        handle: {
          title: APP_ROUTES_KEY.designPreview.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.editor.path,
        children: [
          {
            index: true,
            lazy: lazyPage(() => import("@/pages/editor/page")),
          },
          {
            path: ":fileUuid",
            lazy: lazyPage(() => import("@/pages/editor/page")),
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
            path: APP_ROUTES_KEY.studio.edit.path,
            lazy: lazyPage(() => import("@/pages/studio/edit/page")),
            handle: { title: APP_ROUTES_KEY.studio.edit.meta.title },
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
        lazy: lazyPage(() => import("@/pages/auth/login/page")),
        loader: redirectIfAuthenticated,
        handle: {
          title: APP_ROUTES_KEY.auth.login.meta.title,
        },
      },
      {
        path: APP_ROUTES_KEY.payment.result.path,
        loader: requireSession,
        lazy: lazyPage(() => import("@/pages/payment/result/page")),
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
