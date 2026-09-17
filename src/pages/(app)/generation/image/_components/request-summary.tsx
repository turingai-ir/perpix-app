import { MediaPreviewItem } from "@/components/custom/media-preview-item";

export function ImageRequestSummary({
  prompt,
  referenceImages,
}: {
  prompt: string;
  referenceImages: readonly string[];
}) {
  return (
    <div className="ml-auto flex w-fit max-w-[min(88%,42rem)] flex-col items-end gap-2">
      {referenceImages.length > 0 ? (
        <div className="grid max-w-56 grid-cols-2 gap-2">
          {referenceImages.slice(0, 4).map((fileId, index) => (
            <div key={fileId} className="size-24 overflow-hidden rounded-2xl">
              <MediaPreviewItem fileId={fileId} index={index} type="image" />
            </div>
          ))}
        </div>
      ) : null}
      <div className="bg-muted/80 max-w-full rounded-[1.35rem] rounded-se-md px-4 py-3 text-start shadow-sm">
        <p className="text-sm leading-7 wrap-anywhere sm:text-[0.95rem]">
          {prompt}
        </p>
      </div>
    </div>
  );
}
