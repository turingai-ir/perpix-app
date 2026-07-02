import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FC } from "react";

const AudioPreviewButton: FC<{ file?: File; src?: string }> = ({
  file,
  src,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const objectUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : undefined),
    [file],
  );
  const audioSrc = src ?? objectUrl;
  const Icon = isPlaying ? Pause : Play;

  useEffect(() => {
    if (!objectUrl) return;

    return () => URL.revokeObjectURL(objectUrl);
  }, [objectUrl]);

  useEffect(() => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    audioElement.pause();
    audioElement.load();
    setIsPlaying(false);
  }, [audioSrc]);

  const handleTogglePlayback = async () => {
    const audioElement = audioRef.current;

    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      return;
    }

    await audioElement.play();
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
      />
      <button
        type="button"
        className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring/50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-colors outline-none focus-visible:ring-3 disabled:pointer-events-none disabled:opacity-50"
        aria-label={isPlaying ? "Pause audio" : "Play audio"}
        disabled={!audioSrc}
        onClick={handleTogglePlayback}
      >
        <Icon className="h-5 w-5" />
      </button>
    </div>
  );
};

export { AudioPreviewButton };
