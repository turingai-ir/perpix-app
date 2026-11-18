import { isSafeExternalUrl } from "./safe-external-url";

export const downloadFile = (url: string) => {
  if (!isSafeExternalUrl(url)) return;
  const link = document.createElement("a");
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
};
