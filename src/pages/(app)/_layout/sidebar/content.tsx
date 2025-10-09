import type { FC } from 'react';
import { TbCameraAi, TbPhotoAi } from 'react-icons/tb';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReactQueryApi } from '@/hook/app';
import { useAppTranslate } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';
import { formatLocalizedNumber } from '@/utils';
import { APP_ROUTES_KEY } from '@/router';

const AppLayoutSidebarContent: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const reactQueryApi = useReactQueryApi();

  const userInfoQuery = reactQueryApi.useQuery('get', '/user/get-info', undefined, {
    enabled: false,
  });

  const balanceMenuItems = [
    {
      key: 'image-generations',
      label: t('pages.app.layout.sidebar.menu.imageGeneration.label'),
      href: APP_ROUTES_KEY.generation.image.path,
      Icon: TbPhotoAi,
    },
    {
      key: 'video-generation',
      label: t('pages.app.layout.sidebar.menu.videoGeneration.label'),
      href: '/app/billing/transactions',
      Icon: TbCameraAi,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4 p-4">
      <Card className="border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium ">
              {t('pages.app.layout.sidebar.balanceCard.title')}
            </CardTitle>
            <div className="text-2xl font-semibold tracking-tight text-sidebar-foreground">
              {formatLocalizedNumber({
                value: userInfoQuery.data?.default_wallet?.balance_usdmicro || 0,
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      <nav aria-label={t('pages.app.layout.sidebar.balanceCard.actions.label')}>
        <ul className="flex flex-col gap-1.5">
          {balanceMenuItems.map(({ key, label, href, Icon }) => (
            <li key={key}>
              <Button asChild variant="ghost" className="w-full justify-start gap-3 px-2 text-sm">
                <a href={href}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  {label}
                </a>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AppLayoutSidebarContent;
