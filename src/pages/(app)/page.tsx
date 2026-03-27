/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FC } from 'react';
import { TbCameraAi, TbPhotoAi, TbUserCog } from 'react-icons/tb';
import { useNavigate } from 'react-router';

import SpotlightCard from '@/components/SpotlightCard';
import { Heading3, Muted } from '@/components/ui/typography';
import { useAppTranslate } from '@/hook';
import { APP_I18_KEYS } from '@/services/i18';
import { APP_ROUTES_KEY } from '@/router';

const AppPage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();

  return (
    <div className="w-full h-dvh flex p-4 items-center">
      <div className="w-full max-w-7xl  mx-auto grid grid-cols-12 gap-8">
        <SpotlightCard className="md:col-span-6 col-span-12 xl:col-span-4 h-60 cursor-pointer">
          <div
            className="flex flex-col select-none gap-4"
            onClick={() => {
              navigate(APP_ROUTES_KEY.generation.image.path);
            }}
          >
            <TbPhotoAi className="w-12 h-12" />
            <Heading3>{t('pages.root.accessToSections.imageGeneration.title')}</Heading3>
            <Muted>{t('pages.root.accessToSections.imageGeneration.description')}</Muted>
          </div>
        </SpotlightCard>
        <SpotlightCard className="md:col-span-6 col-span-12 xl:col-span-4 h-60 cursor-pointer">
          <div className="flex flex-col select-none gap-4">
            <TbCameraAi className="w-12 h-12" />
            <Heading3>{t('pages.root.accessToSections.videoGeneration.title')}</Heading3>
            <Muted>{t('pages.root.accessToSections.videoGeneration.description')}</Muted>
          </div>
        </SpotlightCard>

        <SpotlightCard className="md:col-span-6 col-span-12 xl:col-span-4 h-60 cursor-pointer">
          <div
            className="flex flex-col select-none gap-4"
            onClick={() => {
              navigate(APP_ROUTES_KEY.profile.root.path);
            }}
          >
            <TbUserCog className="w-12 h-12" />
            <Heading3>{t('pages.root.accessToSections.userProfile.title')}</Heading3>
            <Muted>{t('pages.root.accessToSections.userProfile.description')}</Muted>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default AppPage;
