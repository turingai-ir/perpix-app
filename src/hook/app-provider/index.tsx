import { useEffect, type FC, type PropsWithChildren } from 'react'
import { useToast } from '@chakra-ui/react'

import { useAppTranslate } from '../use-app-translate'

import { appFetchApiErrorQueue } from '@/services/queue'
import { FetchNetworkError } from '@/utils/custom-fetch/fetch-errors'
import { Outlet } from 'react-router'

const AppProvider: FC = () => {
  const { t } = useAppTranslate()

  const toast = useToast()

  useEffect(() => {
    const errorListener = (error: Error) => {
      if (error instanceof FetchNetworkError) {
      }
      console.log({ error, test: 'attila' })
    }
    appFetchApiErrorQueue.on('add', errorListener)

    return () => {
      appFetchApiErrorQueue.off('add', errorListener)
    }
  }, [])

  return (
    <>
      <Outlet />
    </>
  )
}

export default AppProvider
