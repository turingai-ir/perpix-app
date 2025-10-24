import { useCallback, type FC } from 'react';
import { TbCameraAi, TbPhotoAi } from 'react-icons/tb';
import { selectAtom } from 'jotai/utils';
import { useAtom } from 'jotai';
import { Link } from 'react-router';

import appLayoutAtom from '../_state';

import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAppTranslate } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';
import { formatLocalizedNumber } from '@/utils';
import { APP_ROUTES_KEY } from '@/router';
import { appEventBus } from '@/lib/event-bus';
import { Separator } from '@/components/ui/separator';
import { Muted } from '@/components/ui/typography';
import { useInfiniteScroll } from '@/hooks';
import ErrorSection from '@/components/custom/error-section';
import LoadingSection from '@/components/custom/loading-section';

const requestForChatHistory = () => {
  appEventBus.emit('SIDEBAR_REQUEST_FOR_DATA', undefined);
};

const sidebarHistoryChatsAtom = selectAtom(appLayoutAtom, (val) => val.sidebarHistoryChats);
const walletCurrentBalanceAtom = selectAtom(appLayoutAtom, (val) => val.walletCurrentBalance);
const AppLayoutSidebarContent: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  const [walletCurrentBalance] = useAtom(walletCurrentBalanceAtom);
  const [sidebarHistoryChats] = useAtom(sidebarHistoryChatsAtom);

  const triggerMoreData = useCallback(() => {
    if (
      !sidebarHistoryChats.AllItemsFetched &&
      !sidebarHistoryChats.isLoading &&
      !sidebarHistoryChats.isError
    ) {
      requestForChatHistory();
    }
  }, [
    sidebarHistoryChats.AllItemsFetched,
    sidebarHistoryChats.isError,
    sidebarHistoryChats.isLoading,
  ]);

  const scrollRef = useInfiniteScroll<HTMLDivElement>({
    offset: 100,
    loading: sidebarHistoryChats.isLoading,
    onTrigger: triggerMoreData,
  });

  const menuItems = [
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
    <div className="flex w-full flex-col gap-4 p-4 overflow-auto">
      <Card className="border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium ">
              {t('pages.app.layout.sidebar.balanceCard.title')}
            </CardTitle>
            <div className="text-2xl font-semibold tracking-tight text-sidebar-foreground">
              {formatLocalizedNumber({
                value: walletCurrentBalance || 0,
              })}
            </div>
          </div>
        </CardHeader>
      </Card>

      <nav
        aria-label={t('pages.app.layout.sidebar.balanceCard.actions.label')}
        className="flex flex-col gap-4"
      >
        <ul className="flex flex-col gap-1.5">
          {menuItems.map(({ key, label, href, Icon }) => (
            <li key={key}>
              <Button asChild variant="ghost" className="w-full justify-start gap-3 px-2 text-sm">
                <Link to={href}>
                  <Icon aria-hidden="true" className="h-5 w-5" />
                  {label}
                </Link>
              </Button>
            </li>
          ))}
        </ul>
        <Separator />
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col gap-1.5">
            {sidebarHistoryChats.list.map((item) => (
              <li key={item.id}>
                <Link to={item.link}>
                  <Muted>
                    {item.title.length > 25 ? `${item.title.slice(0, 25)} ...` : item.title}
                  </Muted>
                </Link>
              </li>
            ))}
          </ul>
          <div ref={scrollRef} />
          {sidebarHistoryChats.isLoading ? (
            <div className="w-full justify-center items-center flex">
              <LoadingSection />
            </div>
          ) : null}
          {sidebarHistoryChats.isError ? (
            <ErrorSection
              onRetry={() => {
                requestForChatHistory();
              }}
            />
          ) : null}
        </div>
      </nav>
    </div>
  );
};

export default AppLayoutSidebarContent;
