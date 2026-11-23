import { Expand, Play } from "lucide-react";
import { cn } from "@/shared/lib/utils";

/** Round badge on a preview: an expand hint on hover, or a permanent play mark for video. */
export function GalleryAffordance({ video }: { video: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "glass-blur pointer-events-none absolute end-3 bottom-3 z-2 grid size-10 place-items-center rounded-full border border-night-foreground/16 bg-night/58 text-night-foreground shadow-overlay inset-shadow-highlight transition-[opacity,transform] duration-160 ease-out-quint [--glass-blur:14px] [--glass-saturate:140%] motion-reduce:duration-[0.01ms] [&_svg]:w-4",
        video
          ? "opacity-100"
          : "hover-capable:group-focus-within:translate-y-0 hover-capable:group-focus-within:scale-100 hover-capable:group-focus-within:opacity-100 translate-y-1 scale-[0.96] opacity-0 group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100 max-md:hidden",
      )}
    >
      {video ? <Play /> : <Expand />}
    </span>
  );
}
