import React, { createContext, useContext, useEffect } from "react";
import { useSetAtom } from "jotai";
import * as store from "../_hooks/store";
import { useEditorActions } from "../_hooks/use-editor-actions";
import { loadImage } from "../_services/image-processor";
import type { HistoryState } from "../_model/types";

interface EditorContextProps {
  undo: () => void;
  redo: () => void;
  applyCrop: () => Promise<void>;
  applyResize: () => Promise<void>;
  applyFilters: () => Promise<void>;
  reset: () => void;
}

const EditorContext = createContext<EditorContextProps | null>(null);

export const EditorProvider = ({
  src,
  children,
}: {
  src: string;
  children: React.ReactNode;
}) => {
  const setHistory = useSetAtom(store.historyAtom);
  const setHistoryIndex = useSetAtom(store.historyIndexAtom);
  const setSrcImage = useSetAtom(store.srcImageAtom);
  const setOrigDim = useSetAtom(store.originalDimensionsAtom);
  const setCurrDim = useSetAtom(store.currentDimensionsAtom);
  const setResizeConfig = useSetAtom(store.resizeConfigAtom);
  const setLoading = useSetAtom(store.loadingAtom);
  const setError = useSetAtom(store.errorAtom);

  useEffect(() => {
    setLoading(true);
    loadImage(src)
      .then((img) => {
        const state: HistoryState = {
          src,
          width: img.naturalWidth,
          height: img.naturalHeight,
          filters: { ...store.initialFilters },
        };
        setHistory([state]);
        setHistoryIndex(0);
        setSrcImage(src);
        setOrigDim({ width: img.naturalWidth, height: img.naturalHeight });
        setCurrDim({ width: img.naturalWidth, height: img.naturalHeight });
        setResizeConfig({
          width: img.naturalWidth,
          height: img.naturalHeight,
          lockAspectRatio: true,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [src]);

  const actions = useEditorActions();

  return (
    <EditorContext.Provider value={actions}>{children}</EditorContext.Provider>
  );
};

export const useImageEditor = () => {
  const context = useContext(EditorContext);
  if (!context)
    throw new Error("useImageEditor must be used within EditorProvider");
  return context;
};
