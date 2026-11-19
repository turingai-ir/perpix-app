import { useCallback, useState } from "react";
import type { Clip } from "../../projects/model/clips";

const MAX_HISTORY = 50;

interface Draft {
  clips: Clip[];
  history: Clip[][];
}

/**
 * The clips as the user is editing them, with an undo history. It starts from
 * the saved project once it has loaded and is the source of truth after that:
 * what the server returns later never overwrites an edit in progress.
 */
export function useClipDraft(saved: Clip[] | undefined) {
  const [draft, setDraft] = useState<Draft | null>(null);

  // Taken once, when the project first arrives.
  if (draft === null && saved !== undefined) {
    setDraft({ clips: saved, history: [] });
  }

  const commit = useCallback((clips: Clip[]) => {
    setDraft((current) =>
      current
        ? {
            clips,
            history: [...current.history, current.clips].slice(-MAX_HISTORY),
          }
        : current,
    );
  }, []);

  const undo = useCallback(() => {
    setDraft((current) => {
      const previous = current?.history[current.history.length - 1];
      return current && previous
        ? { clips: previous, history: current.history.slice(0, -1) }
        : current;
    });
  }, []);

  return {
    clips: draft?.clips,
    commit,
    undo,
    canUndo: (draft?.history.length ?? 0) > 0,
  };
}
