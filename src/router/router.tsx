import { createBrowserRouter, redirect } from 'react-router';

import { APP_ROUTES_KEY } from './routes';

import RootLayout from '@/pages/(root)/layout';
import AuthLoginPage from '@/pages/auth/login/page';
import ProfileLayout from '@/pages/profile/layout';
import ProfileSettingsPage from '@/pages/profile/settings/page';
import AppPage from '@/pages/(app)/page';
import { cookies } from '@/utils/cookies';
import { APP_KEYS } from '@/utils';
import AppLayout from '@/pages/(app)/_layout';
import GenerationImagePage from '@/pages/(app)/generation/image/page';
import GenerationImageLayout from '@/pages/(app)/generation/image/_layout';
import PaymentResultPage from '@/pages/payment/result/page';
import GenerationVideoLayout from '@/pages/(app)/generation/video/_layout';
import GenerationVideoPage from '@/pages/(app)/generation/video/page';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: APP_ROUTES_KEY.app.path,
        Component: AppLayout,
        middleware: [
          async () => {
            const token = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN);
            if (!token) {
              throw redirect(APP_ROUTES_KEY.auth.login.path);
            }

            return {};
          },
        ],
        children: [
          { Component: AppPage, index: true },
          {
            path: APP_ROUTES_KEY.generation.image.path,
            Component: GenerationImageLayout,
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
            Component: GenerationVideoLayout,
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
      { path: APP_ROUTES_KEY.auth.login.path, Component: AuthLoginPage },
      {
        path: APP_ROUTES_KEY.profile.root.path,
        Component: ProfileLayout,
        middleware: [
          async () => {
            const token = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN);
            if (!token) {
              throw redirect(APP_ROUTES_KEY.auth.login.path);
            }

            return {};
          },
        ],
        children: [{ Component: ProfileSettingsPage, path: APP_ROUTES_KEY.profile.settings.path }],
      },
      {
        path: APP_ROUTES_KEY.payment.result.path,
        Component: PaymentResultPage,
      },
      {
        path: '*',
        loader: () => redirect(APP_ROUTES_KEY.app.path),
      },
    ],
  },
]);
