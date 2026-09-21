import { MediaPreviewItem } from "@/components/custom/media-preview-item";

export function VideoRequestSummary({
  prompt,
  referenceImages,
}: {
  prompt: string;
  referenceImages: readonly string[];
}) {
  return (
    <div
      data-message-role="user"
      className="ml-auto flex w-fit max-w-[min(90%,42rem)] flex-col items-end gap-2"
    >
      {referenceImages.length > 0 ? (
        <div className="flex max-w-72 flex-wrap justify-end gap-2">
          {referenceImages.slice(0, 4).map((fileId, index) => (
            <div key={fileId} className="size-20 overflow-hidden rounded-2xl">
              <MediaPreviewItem fileId={fileId} index={index} type="image" />
            </div>
          ))}
        </div>
      ) : null}
      <div className="border-primary/10 bg-muted/75 max-w-full rounded-[1.35rem] rounded-se-md border px-4 py-3 shadow-sm backdrop-blur-xl">
        <p className="text-sm leading-7 wrap-anywhere sm:text-[0.95rem]">
          {prompt}
        </p>
      </div>
    </div>
  );
}
