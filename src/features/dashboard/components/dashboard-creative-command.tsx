import { useNavigate } from "react-router";

import {
  DashboardCreationStations,
  type CreativeMode,
} from "./dashboard-creation-stations";

import { APP_ROUTES_KEY } from "@/app/router/routes";

export function DashboardCreativeCommand() {
  const navigate = useNavigate();

  function startCreating(selectedMode: CreativeMode) {
    const path =
      selectedMode === "video"
        ? APP_ROUTES_KEY.generation.video.path
        : APP_ROUTES_KEY.generation.image.path;
    navigate(path);
  }

  return <DashboardCreationStations onEnter={startCreating} />;
}
