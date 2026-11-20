import type { LocalVideoSource } from "../model/clips";

// Hash every byte while keeping each read and digest bounded.
const CHUNK_BYTES = 4 * 1024 * 1024;
export async function fingerprintVideo(file: Blob): Promise<string> {
  const digests = new Uint8Array(Math.ceil(file.size / CHUNK_BYTES) * 32);
  for (let offset = 0; offset < file.size; offset += CHUNK_BYTES) {
    const bytes = await file.slice(offset, offset + CHUNK_BYTES).arrayBuffer();
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    digests.set(new Uint8Array(digest), (offset / CHUNK_BYTES) * 32);
  }
  const digest = await crypto.subtle.digest("SHA-256", digests);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function directory(projectUuid: string, create: boolean) {
  const root = await navigator.storage.getDirectory();
  const studio = await root.getDirectoryHandle("studio-videos", { create });
  return studio.getDirectoryHandle(projectUuid, { create });
}

export async function saveLocalVideo(
  projectUuid: string,
  id: string,
  file: File,
): Promise<void> {
  const project = await directory(projectUuid, true);
  const handle = await project.getFileHandle(id, { create: true });
  const writer = await handle.createWritable();
  await file.stream().pipeTo(writer);
}

export async function loadLocalVideo(
  projectUuid: string,
  source: LocalVideoSource,
): Promise<Blob | null> {
  try {
    const project = await directory(projectUuid, false);
    const handle = await project.getFileHandle(source.id);
    const file = await handle.getFile();
    return file.size === source.size
      ? file.slice(0, file.size, source.content_type)
      : null;
  } catch (error) {
    if (error instanceof DOMException && error.name === "NotFoundError")
      return null;
    throw error;
  }
}

export async function removeLocalVideo(
  projectUuid: string,
  id: string,
): Promise<void> {
  try {
    const project = await directory(projectUuid, false);
    await project.removeEntry(id);
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== "NotFoundError")
      throw error;
  }
}

export async function removeLocalProjectVideos(
  projectUuid: string,
): Promise<void> {
  if (!navigator.storage?.getDirectory) return;
  try {
    const root = await navigator.storage.getDirectory();
    const studio = await root.getDirectoryHandle("studio-videos");
    await studio.removeEntry(projectUuid, { recursive: true });
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== "NotFoundError")
      throw error;
  }
}
