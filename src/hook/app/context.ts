import createClient, { type OpenapiQueryClient } from 'openapi-react-query'
import { createContext } from 'react'

import { apiClinet, type paths } from '@/services/api'

interface Context {
  apiHook: OpenapiQueryClient<paths, `${string}/${string}`>
}
export const appContext = createContext<Context>({
  apiHook: createClient(apiClinet),
})
