const mimeExtensionMap: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

function getFileName(name: string, contentType: string) {
  if (/\.[a-z0-9]+$/i.test(name)) return name;

  const extension = mimeExtensionMap[contentType.split(";")[0] ?? ""];
  return extension ? `${name}.${extension}` : name;
}

function createDownloadUrl(blob: Blob, name: string) {
  const objectUrl = URL.createObjectURL(blob);
  return {
    fileName: getFileName(name, blob.type),
    url: objectUrl,
  };
}

export const createDownloadUrlFromRemoteFile = async (
  url: string,
  name: string,
) => {
  const response = await fetch(url, {
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error("Failed to download file");
  }

  const blob = await response.blob();
  return createDownloadUrl(blob, name);
};

export const revokeDownloadUrl = (url: string) => {
  URL.revokeObjectURL(url);
};

export const downloadFile = (url: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export async function urlToFile(url: string, name: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type });
}
