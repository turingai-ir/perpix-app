import { createBrowserRouter, Navigate } from 'react-router';

import LoginPage from '../pages/login/page';

import { ROUTES_KEY } from './routes';

import RootLayout from '@/pages/root/layout';
import TextPage from '@/pages/text/page';
import ImagePage from '@/pages/image/page';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      { path: ROUTES_KEY.root.path, element: <Navigate to={ROUTES_KEY.text.root.path} /> },
      {
        path: ROUTES_KEY.login.path,
        Component: LoginPage,
      },
      { path: ROUTES_KEY.text.root.path, Component: TextPage },
      { path: ROUTES_KEY.text.chat.path, Component: TextPage },

      { path: ROUTES_KEY.image.root.path, Component: ImagePage },
      { path: ROUTES_KEY.image.chat.path, Component: ImagePage },

      { path: '*', element: <Navigate to={ROUTES_KEY.text.root.path} /> },
    ],
  },
]);
