import type { CropArea } from "../_model/crop-area";

interface ImageEditorMetadataProps {
  crop: CropArea;
  imagePosition: { x: number; y: number };
  imageSize: { height: number; width: number };
  isCropping: boolean;
  ratio: number | null | undefined;
}

export function ImageEditorMetadata(props: ImageEditorMetadataProps) {
  return (
    <>
      <span
        className="sr-only"
        data-testid="image-card"
        data-width={props.imageSize.width}
        data-height={props.imageSize.height}
      />
      {props.isCropping ? (
        <span
          className="sr-only"
          data-testid="crop-frame"
          data-aspect-ratio={props.ratio ?? "free"}
          data-x={props.imagePosition.x + props.crop.x * props.imageSize.width}
        />
      ) : null}
    </>
  );
}
