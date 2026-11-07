export function getClipboardImage(data: DataTransfer): File | null {
  return (
    Array.from(data.files).find((file) => file.type.startsWith("image/")) ??
    Array.from(data.items)
      .find((item) => item.kind === "file" && item.type.startsWith("image/"))
      ?.getAsFile() ??
    null
  );
}

export async function toClipboardImageFile(
  blob: Blob,
  acceptedContentTypes: readonly string[],
): Promise<File | undefined> {
  let image = blob;
  if (!acceptedContentTypes.includes(blob.type)) {
    let outputType: string | undefined;
    if (acceptedContentTypes.includes("image/png")) {
      outputType = "image/png";
    } else if (acceptedContentTypes.includes("image/jpeg")) {
      outputType = "image/jpeg";
    }
    if (!blob.type.startsWith("image/") || !outputType) return;
    image = await convertClipboardImage(blob, outputType);
  }

  const extension = image.type === "image/jpeg" ? "jpg" : image.type.slice(6);
  return new File([image], `clipboard-${Date.now()}.${extension}`, {
    type: image.type,
  });
}

async function convertClipboardImage(blob: Blob, outputType: string) {
  const image = await createImageBitmap(blob);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");
    context.drawImage(image, 0, 0);
    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (converted) =>
          converted
            ? resolve(converted)
            : reject(new Error("Image conversion failed")),
        outputType,
      );
    });
  } finally {
    image.close();
  }
}
