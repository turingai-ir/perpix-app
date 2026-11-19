import type { EditAction } from "../components/edit-tools";

/** The keyboard shortcut of a tool, shown on a large screen; see the editor page for the handler. */
export const SHORTCUTS: Partial<Record<EditAction, string>> = {
  undo: "Ctrl+Z",
  split: "S",
  trimStart: "[",
  trimEnd: "]",
  remove: "Del",
};
