export const testImageBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

export const draggableTestImage = {
  name: "draggable.svg",
  mimeType: "image/svg+xml",
  buffer: Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80"><rect width="120" height="80" fill="red"/></svg>',
  ),
};

export const largeDraggableTestImage = {
  name: "large-draggable.svg",
  mimeType: "image/svg+xml",
  buffer: Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000"><rect width="1000" height="1000" fill="red"/></svg>',
  ),
};
