import { atom } from "jotai";
import { atomWithSyncStorage, createSyncJotaiStorage } from "@/lib/jotai";
import { APP_KEYS } from "@/utils/app-keys";

interface EditorSettings {
  showRuler: boolean;
  showGrid: boolean;
}

const defaultSettings: EditorSettings = {
  showRuler: true,
  showGrid: true,
};

export const editorSettingsAtom = atomWithSyncStorage<EditorSettings>(
  APP_KEYS.LOCAL_STORAGE.EDITOR_SETTINGS,
  defaultSettings,
  createSyncJotaiStorage(),
);

export const showRulerAtom = atom(
  (get) => get(editorSettingsAtom).showRuler,
  (get, set, newValue: boolean) => {
    const current = get(editorSettingsAtom);
    set(editorSettingsAtom, { ...current, showRuler: newValue });
  },
);

export const showGridAtom = atom(
  (get) => get(editorSettingsAtom).showGrid,
  (get, set, newValue: boolean) => {
    const current = get(editorSettingsAtom);
    set(editorSettingsAtom, { ...current, showGrid: newValue });
  },
);

export const zoomAtom = atom<number>(1);

export const panAtom = atom<{ x: number; y: number }>({ x: 0, y: 0 });
