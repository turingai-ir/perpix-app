import { Button, Divider, Drawer, Flex, Popover, ScrollArea } from '@mantine/core';
import { useEffect, useState } from 'react';
import { TbChevronDown, TbMenu } from 'react-icons/tb';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import { useNavigate, useParams } from 'react-router';

import { imageLayoutState } from '../_state';

import Aside from './aside';

import { useAppTranslate, useBodyBackground } from '@/hook';
import { OPEN_AI_IMAGE_MODELS } from '@/services/api';
import { useReactQueryApi } from '@/hook/app';
import { ROUTES_KEY } from '@/router';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [asideStatus, setAsideStatus] = useState(false);
  const [state, setState] = useAtom(imageLayoutState);
  const [versionSelectorPopover, setVersionSelectorPopover] = useState(false);
  const reactQueryApi = useReactQueryApi();
  const navigate = useNavigate();

  const { t } = useAppTranslate();

  const allowedModels = [OPEN_AI_IMAGE_MODELS.dall_e_2, OPEN_AI_IMAGE_MODELS.dall_e_3];

  const params = useParams();

  const getConversion = reactQueryApi.useQuery(
    'get',
    '/open-ai/image/{image_chat_id}',
    {
      params: { path: { image_chat_id: params.id ?? '' } },
    },
    { enabled: !!params.id, retry: false },
  );

  useEffect(() => {
    if (getConversion.data) {
      setState((draft) => {
        draft.currentModel = getConversion.data.model;
      });
    }
  }, [getConversion.data, setState]);

  const handleChangeVersion = (model: OPEN_AI_IMAGE_MODELS) => {
    setState((draft) => {
      draft.currentModel = model;
    });
    setVersionSelectorPopover(false);
  };

  const bodyBackground = useBodyBackground();

  const closeAside = () => {
    setAsideStatus(false);
  };
  const openAside = () => {
    setAsideStatus(true);
  };

  return (
    <main
      className={clsx(['tw-h-dvh tw-relative'])}
      style={{
        background: bodyBackground,
      }}
    >
      <Flex direction="column" className="tw-h-full tw-relative">
        <header className="tw-h-[64px] tw-top-0 tw-z-10 tw-w-full tw-px-4">
          <Flex justify="space-between" className="tw-w-full tw-h-full" align="center">
            <Flex align="center" gap="sm">
              <Button variant="transparent" color="dark" className="tw-ml-auto" onClick={openAside}>
                <TbMenu size={24} />
              </Button>
              {getConversion.isError || getConversion.isLoading ? null : (
                <Popover
                  opened={versionSelectorPopover}
                  onChange={setVersionSelectorPopover}
                  offset={{
                    mainAxis: 10,
                  }}
                  width={250}
                  position="bottom"
                  withArrow
                  shadow="md"
                >
                  <Popover.Target>
                    <Button
                      onClick={() => {
                        setVersionSelectorPopover(true);
                      }}
                      radius="xl"
                      variant="subtle"
                      color="dark"
                      rightSection={<TbChevronDown />}
                    >
                      {state.currentModel}
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown
                    style={{
                      borderRadius: 'var(--mantine-radius-md)',
                      backgroundColor: bodyBackground,
                    }}
                    p="xs"
                  >
                    <ScrollArea h={200}>
                      <Flex direction="column" className="tw-w-full">
                        {allowedModels.map((item) => (
                          <Button
                            key={item}
                            radius="md"
                            variant="subtle"
                            color="dark"
                            onClick={() => {
                              handleChangeVersion(item);
                            }}
                          >
                            {item}
                          </Button>
                        ))}
                      </Flex>
                    </ScrollArea>
                  </Popover.Dropdown>
                </Popover>
              )}
            </Flex>
          </Flex>
        </header>
        <Divider className="!tw-m-0" />
        <Flex className="tw-h-[calc(100%-65px)]  tw-w-full">{children}</Flex>
        {asideStatus ? (
          <Drawer
            closeOnClickOutside
            closeOnEscape
            withCloseButton
            opened={asideStatus}
            onClose={closeAside}
            padding="sm"
            position="left"
            size={300}
            classNames={{
              body: 'tw-h-[calc(100%-60px)]',
            }}
            title={
              <Button
                variant="subtle"
                radius="xl"
                color="dark"
                onClick={() => {
                  navigate(ROUTES_KEY.text.root.path);
                }}
              >
                {t('common.chat')}
              </Button>
            }
          >
            <Aside onClose={closeAside} />
          </Drawer>
        ) : null}
      </Flex>
    </main>
  );
};

export default Layout;
