import { RouterProvider } from 'react-router'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import './services/i18'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { router } from './router'

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}
const direction = 'rtl'

const theme = extendTheme({
  config,
  direction,
  fonts: {
    heading: `'Vazirmatn', sans-serif`,
    body: `'Vazirmatn', sans-serif`,
  },
})

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme} resetCSS portalZIndex={100}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  )
}

export default App
