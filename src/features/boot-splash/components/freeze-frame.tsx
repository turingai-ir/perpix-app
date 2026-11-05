/**
 * Holds the frozen frame on screen while the shatter canvas boots, so the
 * hand-over between the two WebGL scenes never shows an empty frame.
 */
export function FreezeFrame({ frame }: { frame: HTMLCanvasElement }) {
  return (
    <div
      className="absolute inset-0"
      aria-hidden="true"
      ref={(node) => {
        node?.replaceChildren(frame);
      }}
    />
  );
}
