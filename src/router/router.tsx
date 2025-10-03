import { createBrowserRouter, Navigate } from 'react-router';

import { ROUTES_KEY } from './routes';

import RootLayout from '@/pages/root/layout';
import AuthLoginPage from '@/pages/auth/login/page';
import RootPage from '@/pages/root/page';
import ProfileLayout from '@/pages/profile/layout';
// import ProfilePage from '@/pages/profile/page';
import ProfileSettingsPage from '@/pages/profile/settings/page';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: ROUTES_KEY.root.path, Component: RootPage },
      { path: ROUTES_KEY.auth.login.path, Component: AuthLoginPage },
      {
        path: ROUTES_KEY.profile.root,
        Component: ProfileLayout,
        children: [
          // { Component: ProfilePage, index: true },
          { Component: ProfileSettingsPage, path: ROUTES_KEY.profile.settings },
        ],
      },

      { path: '*', element: <Navigate to={ROUTES_KEY.text.root.path} /> },
    ],
  },
]);
