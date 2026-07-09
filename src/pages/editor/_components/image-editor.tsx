export interface ImageEditorProps {
  src: string;
}

export function ImageEditor({ src }: ImageEditorProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-neutral-950 p-4">
      <img
        src={src}
        alt="Editor Preview"
        className="max-h-[90%] max-w-[90%] rounded-lg object-contain shadow-2xl"
      />
    </div>
  );
}
