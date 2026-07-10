import { Check, Crop, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CROP_RATIO_OPTIONS, type CropRatioId } from "../_model/crop-ratios";

interface ImageEditorToolbarProps {
  isCropping: boolean;
  isImageSelected: boolean;
  onApplyCrop: () => void;
  onBeginCrop: () => void;
  onCancelCrop: () => void;
  onSelectRatio: (ratio: CropRatioId) => void;
  selectedRatio: CropRatioId;
}

export function ImageEditorToolbar(props: ImageEditorToolbarProps) {
  if (!props.isImageSelected) return null;

  return (
    <div className="absolute inset-x-3 bottom-3 z-10 mx-auto flex w-fit max-w-[calc(100%-1.5rem)] flex-col items-center gap-2 rounded-2xl border border-white/10 bg-neutral-900/95 p-2 text-white shadow-2xl backdrop-blur">
      {props.isCropping ? (
        <CropControls {...props} />
      ) : (
        <div role="toolbar" aria-label="ابزارهای تصویر">
          <Button
            variant="ghost"
            className="h-11 flex-col gap-0.5 px-5 text-white hover:bg-white/10 hover:text-white"
            onClick={props.onBeginCrop}
          >
            <Crop />
            <span className="text-xs">برش تصویر</span>
          </Button>
        </div>
      )}
    </div>
  );
}

function CropControls(props: ImageEditorToolbarProps) {
  return (
    <>
      <div
        role="toolbar"
        aria-label="نسبت برش"
        className="flex max-w-full gap-1 overflow-x-auto"
        dir="ltr"
      >
        {CROP_RATIO_OPTIONS.map((ratio) => (
          <Button
            key={ratio.id}
            variant="ghost"
            aria-pressed={props.selectedRatio === ratio.id}
            className={cn(
              "text-white hover:bg-white/10 hover:text-white",
              props.selectedRatio === ratio.id &&
                "bg-white text-neutral-950 hover:bg-white hover:text-neutral-950",
            )}
            onClick={() => props.onSelectRatio(ratio.id)}
          >
            {ratio.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white"
          onClick={props.onCancelCrop}
        >
          <X />
          انصراف
        </Button>
        <Button onClick={props.onApplyCrop}>
          <Check />
          اعمال برش
        </Button>
      </div>
    </>
  );
}
