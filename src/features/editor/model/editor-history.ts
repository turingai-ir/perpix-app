export interface EditorHistory<TSnapshot> {
  current: TSnapshot;
  future: TSnapshot[];
  past: TSnapshot[];
}

const MAX_HISTORY_ENTRIES = 100;

export function createEditorHistory<TSnapshot>(
  initialSnapshot: TSnapshot,
): EditorHistory<TSnapshot> {
  return { current: initialSnapshot, future: [], past: [] };
}

export function commitEditorHistory<TSnapshot>(
  history: EditorHistory<TSnapshot>,
  nextSnapshot: TSnapshot,
): EditorHistory<TSnapshot> {
  return {
    current: nextSnapshot,
    future: [],
    past: [...history.past, history.current].slice(-MAX_HISTORY_ENTRIES),
  };
}

export function undoEditorHistory<TSnapshot>(
  history: EditorHistory<TSnapshot>,
): EditorHistory<TSnapshot> {
  const previousSnapshot = history.past[history.past.length - 1];
  if (!previousSnapshot) return history;
  return {
    current: previousSnapshot,
    future: [history.current, ...history.future],
    past: history.past.slice(0, -1),
  };
}

export function redoEditorHistory<TSnapshot>(
  history: EditorHistory<TSnapshot>,
): EditorHistory<TSnapshot> {
  const nextSnapshot = history.future[0];
  if (!nextSnapshot) return history;
  return {
    current: nextSnapshot,
    future: history.future.slice(1),
    past: [...history.past, history.current],
  };
}
