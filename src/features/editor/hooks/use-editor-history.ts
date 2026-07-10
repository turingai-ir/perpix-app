import { useCallback, useEffect, useRef, useState } from "react";
import {
  commitEditorHistory,
  createEditorHistory,
  redoEditorHistory,
  undoEditorHistory,
} from "../model/editor-history";
import {
  loadEditorSnapshot,
  saveEditorSnapshot,
} from "../services/editor-snapshot-store";

export function useEditorHistory<TSnapshot>(
  initialSnapshot: TSnapshot,
  documentId?: string,
) {
  const [history, setHistory] = useState(() =>
    createEditorHistory(initialSnapshot),
  );
  const [isHydrated, setIsHydrated] = useState(!documentId);
  const hasLocalEditsRef = useRef(false);

  useEffect(() => {
    if (!documentId) return;
    let isActive = true;
    setIsHydrated(false);
    void loadEditorSnapshot<TSnapshot>(documentId).then((snapshot) => {
      if (isActive && snapshot && !hasLocalEditsRef.current) {
        setHistory(createEditorHistory(snapshot));
      }
      if (isActive) setIsHydrated(true);
    });
    return () => {
      isActive = false;
    };
  }, [documentId]);

  useEffect(() => {
    if (!documentId || !isHydrated) return;
    void saveEditorSnapshot(documentId, history.current);
  }, [documentId, history.current, isHydrated]);
  const commit = useCallback((nextSnapshot: TSnapshot) => {
    hasLocalEditsRef.current = true;
    setHistory((currentHistory) =>
      commitEditorHistory(currentHistory, nextSnapshot),
    );
  }, []);
  const undo = useCallback(() => {
    hasLocalEditsRef.current = true;
    setHistory((currentHistory) => undoEditorHistory(currentHistory));
  }, []);
  const redo = useCallback(() => {
    hasLocalEditsRef.current = true;
    setHistory((currentHistory) => redoEditorHistory(currentHistory));
  }, []);
  return {
    canRedo: history.future.length > 0,
    canUndo: history.past.length > 0,
    commit,
    current: history.current,
    redo,
    undo,
  };
}
