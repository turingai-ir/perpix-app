import { RouterProvider } from 'react-router'
import './services/i18/i18'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { DirectionProvider, MantineProvider, type MantineThemeOverride } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

import { router } from './router'

import './styles/globals.css'
import './styles/tailwind.css'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

const theme: MantineThemeOverride = {
  fontFamily: `'Vazirmatn', sans-serif`,
  primaryColor: 'blue',
  breakpoints: {
    xs: '36rem',
    sm: '48rem',
    md: '62rem',
    lg: '75rem',
    xl: '88rem',
  },
}
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} withCssVariables withGlobalClasses withStaticClasses>
        <DirectionProvider detectDirection>
          <Notifications />
          <RouterProvider router={router} />
        </DirectionProvider>
      </MantineProvider>
    </QueryClientProvider>
  )
}

export default App
