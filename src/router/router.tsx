import { createBrowserRouter, Navigate, redirect } from 'react-router';

import { APP_ROUTES_KEY } from './routes';

import RootLayout from '@/pages/(root)/layout';
import AuthLoginPage from '@/pages/auth/login/page';
// import RootPage from '@/pages/(root)/page';
import ProfileLayout from '@/pages/profile/layout';
// import ProfilePage from '@/pages/profile/page';
import ProfileSettingsPage from '@/pages/profile/settings/page';
import AppPage from '@/pages/(app)/page';
import { cookies } from '@/utils/cookies';
import { APP_KEYS } from '@/utils';
import AppLayout from '@/pages/(app)/_layout';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: APP_ROUTES_KEY.app.path,
        Component: AppLayout,
        children: [{ Component: AppPage, index: true }],
        middleware: [
          async () => {
            const token = cookies().get(APP_KEYS.COOKIES.ACCESS_TOKEN);
            if (!token) {
              throw redirect(APP_ROUTES_KEY.auth.login.path);
            }

            return {};
          },
        ],
      },
      { path: APP_ROUTES_KEY.auth.login.path, Component: AuthLoginPage },
      {
        path: APP_ROUTES_KEY.profile.root.path,
        Component: ProfileLayout,
        children: [
          // { Component: ProfilePage, index: true },
          { Component: ProfileSettingsPage, path: APP_ROUTES_KEY.profile.settings.path },
        ],
      },

      { path: '*', element: <Navigate to={APP_ROUTES_KEY.text.root.path} /> },
    ],
  },
]);
