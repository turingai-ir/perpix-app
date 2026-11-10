import { useRef, useState, type PointerEvent } from "react";
import { useAppTranslate } from "@/shared/hooks";
import type { useModel } from "@/features/generation/hooks/use-model";

export function useModelDiscovery(model: ReturnType<typeof useModel>) {
  const { t } = useAppTranslate();
  const [open, setOpen] = useState(false);
  const openedWithTouch = useRef(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const models = model.modelsListState.data ?? [];
  const selected = models.find((item) => item.uuid === model.currentModel);
  const loading = model.modelsListState.isLoading;

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    openedWithTouch.current = event.pointerType !== "mouse";
  };

  const handleKeyDown = () => {
    openedWithTouch.current = false;
  };

  const handleSelectModel = (uuid: string) => {
    model.setCurrentModel(uuid);
    setOpen(false);
  };

  return {
    t,
    open,
    setOpen,
    openedWithTouch,
    popoverRef,
    models,
    selected,
    loading,
    allowedModelNames: model.allowedModelNames,
    isModelsError: model.modelsListState.isError,
    handlePointerDown,
    handleKeyDown,
    handleSelectModel,
  };
}
