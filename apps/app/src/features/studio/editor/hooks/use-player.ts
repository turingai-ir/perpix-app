import { useCallback, useEffect, useRef, useState } from "react";
import { locate, type Timeline } from "../model/timeline";

/** How close to a clip's end counts as the end, so the next clip starts without a stutter. */
const END_SLACK_MS = 30;

/**
 * Plays the timeline's clips one after another in a single video element.
 * The time it reports is the timeline's, not the file's, so scrubbing, the
 * progress bar and the captions all share one clock. A clip of another file
 * swaps the element's source; a clip of the same file only seeks.
 */
export function usePlayer(
  timeline: Timeline,
  urlFor: (fileUuid: string) => string | undefined,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [timeMs, setTimeMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const indexRef = useRef(0);
  const playingRef = useRef(false);
  const settling = useRef(false);

  const setPlayingState = (value: boolean) => {
    playingRef.current = value;
    setPlaying(value);
  };

  const enter = useCallback(
    (index: number, offsetMs: number, play: boolean) => {
      const video = videoRef.current;
      const segment = timeline.segments[index];
      const url = segment && urlFor(segment.clip.file_uuid);
      if (!video || !segment) return;
      indexRef.current = index;
      video.onloadedmetadata = null;
      if (!url) {
        video.pause();
        if (video.hasAttribute("src")) {
          video.removeAttribute("src");
          video.load();
        }
        settling.current = false;
        setPlayingState(false);
        return;
      }
      const target = (segment.clip.source_in_ms + offsetMs) / 1000;
      const start = () => {
        video.currentTime = target;
        settling.current = false;
        if (play) void video.play().catch(() => setPlayingState(false));
      };
      settling.current = true;
      if (video.getAttribute("src") !== url) {
        video.onloadedmetadata = start;
        video.src = url;
      } else if (video.readyState < HTMLMediaElement.HAVE_METADATA) {
        video.onloadedmetadata = start;
      } else {
        start();
      }
    },
    [timeline, urlFor],
  );

  // Show the frame when a file preview loads or a local source is reattached.
  useEffect(() => {
    const spot = locate(timeline, timeMs);
    const segment = spot && timeline.segments[spot.index];
    if (!spot || !segment || !videoRef.current) return;
    const url = urlFor(segment.clip.file_uuid);
    if (videoRef.current.getAttribute("src") !== (url ?? null)) {
      enter(
        spot.index,
        spot.sourceMs - segment.clip.source_in_ms,
        playingRef.current,
      );
    }
  }, [enter, timeline, timeMs, urlFor]);

  // While playing, follow the video's own clock once per frame.
  useEffect(() => {
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      const video = videoRef.current;
      const segment = timeline.segments[indexRef.current];
      if (video && segment && !settling.current) {
        const sourceMs = video.currentTime * 1000;
        if (
          sourceMs >= segment.clip.source_out_ms - END_SLACK_MS ||
          video.ended
        ) {
          const next = indexRef.current + 1;
          if (next < timeline.segments.length) {
            setTimeMs(timeline.segments[next].startMs);
            enter(next, 0, true);
          } else {
            video.pause();
            setTimeMs(timeline.durationMs);
            setPlayingState(false);
            return;
          }
        } else {
          setTimeMs(segment.startMs + sourceMs - segment.clip.source_in_ms);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, timeline, enter]);

  const seek = useCallback(
    (ms: number) => {
      const spot = locate(timeline, ms);
      if (!spot) return;
      const segment = timeline.segments[spot.index];
      setTimeMs(Math.min(Math.max(0, ms), timeline.durationMs));
      enter(
        spot.index,
        spot.sourceMs - segment.clip.source_in_ms,
        playingRef.current,
      );
    },
    [timeline, enter],
  );

  const toggle = useCallback(() => {
    const video = videoRef.current;
    if (!video || timeline.segments.length === 0) return;
    if (playingRef.current) {
      video.pause();
      setPlayingState(false);
      return;
    }
    const restart = timeMs >= timeline.durationMs - END_SLACK_MS;
    const segment = timeline.segments[restart ? 0 : indexRef.current];
    if (!segment || !urlFor(segment.clip.file_uuid)) return;
    if (restart) {
      setTimeMs(0);
      enter(0, 0, true);
    } else {
      void video.play().catch(() => setPlayingState(false));
    }
    setPlayingState(true);
  }, [timeline, timeMs, enter, urlFor]);

  const pause = useCallback(() => {
    videoRef.current?.pause();
    playingRef.current = false;
    setPlaying(false);
  }, []);

  return { videoRef, timeMs, playing, seek, toggle, pause };
}
