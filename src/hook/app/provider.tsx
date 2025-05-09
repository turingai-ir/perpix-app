import { type FC, type PropsWithChildren } from 'react'
import createClient from 'openapi-react-query'

import { appContext } from './context'

import { apiClinet } from '@/services/api'

const AppContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const apiHook = createClient(apiClinet)

  return <appContext.Provider value={{ apiHook }}>{children}</appContext.Provider>
}

export default AppContextProvider
