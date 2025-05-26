import { useEffect, type FC } from 'react';
import { Outlet } from 'react-router';
import { notifications } from '@mantine/notifications';
import { Flex } from '@mantine/core';

import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from '@/utils/custom-fetch/fetch-errors';
import { HttpStatus } from '@/utils';
import { useAppTranslate } from '@/hook';
import { appEventBus } from '@/services/event-bus';

const RootLayout: FC = () => {
  const { t } = useAppTranslate();

  useEffect(() => {
    const errorhandler = async (error: unknown) => {
      if (error instanceof FetchNetworkError) {
        notifications.show({
          title: t('common.error'),
          color: 'red',
          message: t('common.fetchErrors.network'),
        });
      }

      if (error instanceof FetchTimeoutError) {
        notifications.show({
          title: t('common.error'),
          color: 'red',
          message: t('common.fetchErrors.timeout'),
        });
      }

      if (
        error instanceof FetchHttpError &&
        typeof error.request !== 'string' &&
        error.request.method.toLowerCase() !== 'get'
      ) {
        // validation error
        if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
          try {
            const parseError = await error.response.clone().json();
            if (parseError?.detail && parseError.detail instanceof Array) {
              const messages: string[] = [];
              parseError.detail.forEach((i: any) => {
                if (i?.msg && typeof i?.msg === 'string') {
                  messages.push(i.msg);
                }
              });
              notifications.show({
                title: t('common.error'),
                color: 'red',
                message: (
                  <Flex direction={'column'} gap={'xs'}>
                    {messages.map((i, index) => (
                      <span key={index}>{i}</span>
                    ))}
                  </Flex>
                ),
              });
            }
            // eslint-disable-next-line unused-imports/no-unused-vars
          } catch (_e) {}
        }
        if (error.response.status === HttpStatus.BAD_REQUEST) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === 'string') {
              notifications.show({
                title: t('common.error'),
                color: 'red',
                message: (
                  <Flex direction={'column'} gap={'xs'}>
                    <span>{parseError?.detail}</span>
                  </Flex>
                ),
              });
            }
          } catch (_e) {}
        }
      }
    };

    const appEventBusListener = appEventBus.on('API_ERROR_EVENT', errorhandler);
    return () => {
      appEventBusListener();
    };
  }, [t]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootLayout;
