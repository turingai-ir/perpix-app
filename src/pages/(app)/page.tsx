import type { FC } from "react";
import { TbCameraAi, TbPhotoAi, TbUserCog } from "react-icons/tb";
import { Link } from "react-router";

import SpotlightCard from "@/components/SpotlightCard";
import { Heading3, Muted } from "@/components/ui/typography";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";
import { APP_ROUTES_KEY } from "@/router/routes";

const AppPage: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  return (
    <div className="flex min-h-full w-full items-center p-4">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-12 gap-8">
        <SpotlightCard className="col-span-12 h-60 cursor-pointer md:col-span-6 xl:col-span-4">
          <Link
            to={APP_ROUTES_KEY.generation.image.path}
            className="focus-visible:outline-ring flex h-full flex-col gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <TbPhotoAi className="h-12 w-12" />
            <Heading3>
              {t("pages.root.accessToSections.imageGeneration.title")}
            </Heading3>
            <Muted>
              {t("pages.root.accessToSections.imageGeneration.description")}
            </Muted>
          </Link>
        </SpotlightCard>
        <SpotlightCard className="col-span-12 h-60 cursor-pointer md:col-span-6 xl:col-span-4">
          <Link
            to={APP_ROUTES_KEY.generation.video.path}
            className="focus-visible:outline-ring flex h-full flex-col gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <TbCameraAi className="h-12 w-12" />
            <Heading3>
              {t("pages.root.accessToSections.videoGeneration.title")}
            </Heading3>
            <Muted>
              {t("pages.root.accessToSections.videoGeneration.description")}
            </Muted>
          </Link>
        </SpotlightCard>

        <SpotlightCard className="col-span-12 h-60 cursor-pointer md:col-span-6 xl:col-span-4">
          <Link
            to={APP_ROUTES_KEY.profile.root.path}
            className="focus-visible:outline-ring flex h-full flex-col gap-4 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4"
          >
            <TbUserCog className="h-12 w-12" />
            <Heading3>
              {t("pages.root.accessToSections.userProfile.title")}
            </Heading3>
            <Muted>
              {t("pages.root.accessToSections.userProfile.description")}
            </Muted>
          </Link>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default AppPage;
