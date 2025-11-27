import { useEffect, type FC } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { toast } from 'sonner';

import {
  FetchHttpError,
  FetchNetworkError,
  FetchTimeoutError,
} from '@/utils/custom-fetch/fetch-errors';
import { APP_KEYS, HttpStatus } from '@/utils';
import { useAppTranslate } from '@/hook';
import { appEventBus } from '@/lib/event-bus';
import { cookies } from '@/utils/cookies';
import { APP_ROUTES_KEY } from '@/router';

const RootLayout: FC = () => {
  const { t } = useAppTranslate();
  const navigate = useNavigate();

  useEffect(() => {
    const errorhandler = async (error: unknown) => {
      if (error instanceof FetchNetworkError) {
        toast.error(t('common.fetchErrors.network'));
      }

      if (error instanceof FetchTimeoutError) {
        toast.error(t('common.fetchErrors.network'));
      }

      // 401 error
      if (error instanceof FetchHttpError && error.response.status === HttpStatus.UNAUTHORIZED) {
        const cookie = cookies();
        cookie.remove(APP_KEYS.COOKIES.ACCESS_TOKEN);
        navigate(APP_ROUTES_KEY.auth.login.path);
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
              toast.error(
                <div className="gap-1 flex flex-col ">
                  {messages.map((i, index) => (
                    <span key={index}>{i}</span>
                  ))}
                </div>,
              );
            }
            // eslint-disable-next-line unused-imports/no-unused-vars
          } catch (_e) {
            /* empty */
          }
        }
        if (error.response.status === HttpStatus.BAD_REQUEST) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === 'string') {
              toast.error(
                <div className="gap-1 flex flex-col ">
                  <span>{parseError?.detail}</span>
                </div>,
              );
            }
          } catch (_e) {
            /* empty */
          }
        }
        if (error.response.status === HttpStatus.TOO_MANY_REQUESTS) {
          try {
            const parseError = await error.response.clone().json();
            if (typeof parseError?.detail === 'string') {
              toast.error(
                <div className="gap-1 flex flex-col ">
                  <span>{parseError?.detail}</span>
                </div>,
              );
            }
          } catch (_e) {
            /* empty */
          }
        }
        if (error.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
          toast.error(
            <div className="gap-1 flex flex-col ">
              <span>{t('common.fetchErrors.serverError')}</span>
            </div>,
          );
        }
      }
    };

    const appEventBusListener = appEventBus.on('API_ERROR_EVENT', errorhandler);
    return () => {
      appEventBusListener();
    };
  }, [navigate, t]);

  return (
    <>
      <Outlet />
    </>
  );
};

export default RootLayout;
