import { Pause, Play } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";

const VideoPreviewButton: FC<{ file?: File; src?: string }> = ({
  file,
  src,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );
  const videoSrc = src ?? objectUrl;
  const Icon = isPlaying ? Pause : Play;

  useEffect(() => {
    if (!objectUrl) return;

    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    videoElement.pause();
    videoElement.load();
    setIsPlaying(false);
  }, [videoSrc]);

  const handleTogglePlayback = useCallback(async () => {
    const videoElement = videoRef.current;

    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
      return;
    }

    await videoElement.play();
  }, [isPlaying]);

  return (
    <div className="relative h-full w-full">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={videoSrc}
        className="h-full w-full object-cover transition-transform group-hover:scale-105"
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <button
        type="button"
        className="bg-primary/90 text-primary-foreground hover:bg-primary focus-visible:ring-ring/50 absolute inset-0 m-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-full shadow-sm transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50"
        aria-label={isPlaying ? "Pause video" : "Play video"}
        disabled={!videoSrc}
        onClick={handleTogglePlayback}
      >
        <Icon className="h-5 w-5" />
      </button>
    </div>
  );
};

export { VideoPreviewButton };
