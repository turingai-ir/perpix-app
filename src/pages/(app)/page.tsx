/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import type { FC } from "react";
import { TbCameraAi, TbPhotoAi, TbUserCog } from "react-icons/tb";
import { useNavigate } from "react-router";

import SpotlightCard from "@/components/SpotlightCard";
import { Heading3, Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hook";
import { APP_I18_KEYS } from "@/services/i18";
import { APP_ROUTES_KEY } from "@/router/routes";

const AppPage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-full w-full items-center p-4">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-8">
        <SpotlightCard className="col-span-12 h-60 cursor-pointer md:col-span-6 xl:col-span-4">
          <div
            className="flex flex-col gap-4 select-none"
            onClick={() => {
              navigate(APP_ROUTES_KEY.generation.image.path);
            }}
          >
            <TbPhotoAi className="h-12 w-12" />
            <Heading3>
              {t("pages.root.accessToSections.imageGeneration.title")}
            </Heading3>
            <Muted>
              {t("pages.root.accessToSections.imageGeneration.description")}
            </Muted>
          </div>
        </SpotlightCard>
        <SpotlightCard className="col-span-12 h-60 cursor-pointer md:col-span-6 xl:col-span-4">
          <div
            onClick={() => {
              navigate(APP_ROUTES_KEY.generation.video.path);
            }}
            className="flex flex-col gap-4 select-none"
          >
            <TbCameraAi className="h-12 w-12" />
            <Heading3>
              {t("pages.root.accessToSections.videoGeneration.title")}
            </Heading3>
            <Muted>
              {t("pages.root.accessToSections.videoGeneration.description")}
            </Muted>
          </div>
        </SpotlightCard>

        <SpotlightCard className="col-span-12 h-60 cursor-pointer md:col-span-6 xl:col-span-4">
          <div
            className="flex flex-col gap-4 select-none"
            onClick={() => {
              navigate(APP_ROUTES_KEY.profile.root.path);
            }}
          >
            <TbUserCog className="h-12 w-12" />
            <Heading3>
              {t("pages.root.accessToSections.userProfile.title")}
            </Heading3>
            <Muted>
              {t("pages.root.accessToSections.userProfile.description")}
            </Muted>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default AppPage;
