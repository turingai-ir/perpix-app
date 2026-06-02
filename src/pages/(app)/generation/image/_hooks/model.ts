import { useEffect, useState } from "react";

import { useReactQueryApi } from "@/hook/app";

export const useModel = () => {
  const { useQuery } = useReactQueryApi();

  const [currentModel, setCurrentModel] = useState<string | undefined>(
    undefined,
  );

  const modelsListState = useQuery("get", "/ai-registry/models");

  const modelState = useQuery(
    "get",
    "/ai-registry/models/{ai_model_uuid}",
    {
      params: {
        path: {
          ai_model_uuid: currentModel ?? "",
        },
      },
    },
    { enabled: !!currentModel },
  );

  useEffect(() => {
    if (modelsListState.data?.length)
      setCurrentModel(modelsListState.data[0].uuid);
  }, [modelsListState.data]);

  return {
    currentModel,
    setCurrentModel,
    modelState,
    modelsListState,
  };
};
