import { createBrowserRouter } from 'react-router';

import RootPage from '../pages/root/page';
import LoginPage from '../pages/login/page';

import { ROUTES_KEY } from './routes';

import RootLayout from '@/pages/root/layout';

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    children: [
      {
        path: ROUTES_KEY.root.path,
        Component: RootPage,
      },
      {
        path: ROUTES_KEY.login.path,
        Component: LoginPage,
      },
    ],
  },
]);
