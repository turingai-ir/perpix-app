export const downloadFile = (url: string, name: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.target = "_blank";
  link.download = name;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export async function urlToFile(url: string, name: string) {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type });
}
