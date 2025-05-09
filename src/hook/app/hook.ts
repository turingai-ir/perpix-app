import { useContext } from 'react'

import { appContext } from './context'

export const useApp = () => {
  const context = useContext(appContext)
  if (!context) {
    throw new Error('App Provider is required')
  }
  return context
}

export const useReactQueryApi = () => {
  const context = useContext(appContext)
  if (!context) {
    throw new Error('App Provider is required')
  }
  return context.apiHook
}
