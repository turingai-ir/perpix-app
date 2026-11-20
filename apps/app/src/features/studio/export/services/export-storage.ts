export async function exportDirectory() {
  return (await navigator.storage.getDirectory()).getDirectoryHandle(
    "studio-exports",
    { create: true },
  );
}

export async function removeExport(id: string) {
  try {
    await (await exportDirectory()).removeEntry(id);
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== "NotFoundError")
      throw error;
  }
}

export async function clearExportStorage() {
  if (!navigator.storage?.getDirectory) return;
  try {
    const root = await navigator.storage.getDirectory();
    await root.removeEntry("studio-exports", { recursive: true });
  } catch (error) {
    if (!(error instanceof DOMException) || error.name !== "NotFoundError")
      throw error;
  }
}
