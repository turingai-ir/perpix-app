import { get, set } from "idb-keyval";

const SNAPSHOT_KEY_PREFIX = "editor-snapshot:";

export async function loadEditorSnapshot<TSnapshot>(
  documentId: string,
): Promise<TSnapshot | null> {
  try {
    return (await get<TSnapshot>(SNAPSHOT_KEY_PREFIX + documentId)) ?? null;
  } catch {
    return null;
  }
}

export async function saveEditorSnapshot<TSnapshot>(
  documentId: string,
  snapshot: TSnapshot,
): Promise<void> {
  try {
    await set(SNAPSHOT_KEY_PREFIX + documentId, snapshot);
  } catch {
    // Editing remains fully local if IndexedDB is unavailable.
  }
}
