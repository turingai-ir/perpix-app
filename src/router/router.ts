import { createBrowserRouter } from 'react-router'

import RootPage from '../pages/root/page'
import { ROUTE_KEYS } from '../utils'
import LoginPage from '../pages/login/page'

import AppProvider from '@/hook/app-provider'

export const router = createBrowserRouter([
  {
    Component: AppProvider,
    children: [
      {
        path: ROUTE_KEYS.root.path,
        Component: RootPage,
      },
      {
        path: ROUTE_KEYS.login.path,
        Component: LoginPage,
      },
    ],
  },
])
