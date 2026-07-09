import { useAtom, useSetAtom, useAtomValue } from "jotai";
import * as store from "./store";
import { processImage } from "../_services/image-processor";
import type { HistoryState } from "../_model/types";

export function useEditorActions() {
  const [history, setHistory] = useAtom(store.historyAtom);
  const [historyIndex, setHistoryIndex] = useAtom(store.historyIndexAtom);
  const [filters, setFilters] = useAtom(store.filtersAtom);
  const [cropConfig] = useAtom(store.cropConfigAtom);
  const resizeConfig = useAtomValue(store.resizeConfigAtom);
  const setSrcImage = useSetAtom(store.srcImageAtom);
  const setCurrDim = useSetAtom(store.currentDimensionsAtom);
  const setSaving = useSetAtom(store.savingAtom);
  const setError = useSetAtom(store.errorAtom);
  const setActiveTool = useSetAtom(store.activeToolAtom);

  const updateState = (newState: HistoryState) => {
    const newHist = history.slice(0, historyIndex + 1);
    setHistory([...newHist, newState]);
    setHistoryIndex(newHist.length);
    setSrcImage(newState.src);
    setCurrDim({ width: newState.width, height: newState.height });
    setFilters(newState.filters);
    setActiveTool("none");
  };

  const applyAction = async (
    fn: (
      src: string,
    ) => Promise<{ src: string; width: number; height: number }>,
  ) => {
    setSaving(true);
    try {
      const current = history[historyIndex];
      const res = await fn(current.src);
      updateState({
        src: res.src,
        width: res.width,
        height: res.height,
        filters: { ...store.initialFilters },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const navigateHistory = (idx: number) => {
    setHistoryIndex(idx);
    const state = history[idx];
    setSrcImage(state.src);
    setCurrDim({ width: state.width, height: state.height });
    setFilters(state.filters);
  };

  return {
    undo: () => historyIndex > 0 && navigateHistory(historyIndex - 1),
    redo: () =>
      historyIndex < history.length - 1 && navigateHistory(historyIndex + 1),
    applyCrop: () =>
      applyAction((src) => processImage(src, { crop: cropConfig, filters })),
    applyResize: () =>
      applyAction((src) =>
        processImage(src, {
          resize: { width: resizeConfig.width, height: resizeConfig.height },
          filters,
        }),
      ),
    applyFilters: () => applyAction((src) => processImage(src, { filters })),
    reset: () => navigateHistory(0),
  };
}
