import {
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
  type TransitionEvent,
} from "react";

import { cn } from "@/lib/utils";
import {
  shouldShowSplash,
  useAppReady,
  useSceneSupport,
} from "../hooks/use-app-ready";
import { BootSlogan } from "./boot-slogan";
import { BootSplashHud } from "./boot-splash-hud";
import { copyCanvas } from "./copy-canvas";
import { FreezeFrame } from "./freeze-frame";

const VersusScene = lazy(() => import("./versus-scene"));
const IceShatter3D = lazy(() => import("./ice-shatter-3d"));

/** Long enough for the fighters to land at least one clash. */
const FIGHT_MIN_MS = 2400;
const STATIC_MIN_MS = 400;
const SCENE_LATE_MS = 3000;

type ReadySource = Parameters<typeof useAppReady>[0];

/**
 * Full-screen first-load splash: two logo "P"s fight until the app is ready,
 * then the frozen frame shatters into 3D ice revealing the app behind it.
 */
export function BootSplash({ router }: { router: ReadySource }) {
  const [show] = useState(shouldShowSplash);
  return show ? <BootSplashOverlay router={router} /> : null;
}

function BootSplashOverlay({ router }: { router: ReadySource }) {
  const { enabled, lite } = useSceneSupport();
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [sceneLate, setSceneLate] = useState(false);
  const [shatterPainted, setShatterPainted] = useState(false);
  const [done, setDone] = useState(false);
  const ready = useAppReady(
    router,
    canvas ? FIGHT_MIN_MS : STATIC_MIN_MS,
    !enabled || canvas !== null || sceneLate,
  );

  // A slow 3D chunk must never hold the app hostage: fall back to a fade.
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setTimeout(() => setSceneLate(true), SCENE_LATE_MS);
    return () => window.clearTimeout(timer);
  }, [enabled]);

  // Freeze the current frame exactly once, when the shatter begins.
  const snapshot = useMemo(
    () => (ready && canvas ? copyCanvas(canvas) : null),
    [ready, canvas],
  );
  const fading = ready && !snapshot;

  const finishFade = (event: TransitionEvent<HTMLDivElement>) => {
    if (fading && event.target === event.currentTarget) setDone(true);
  };

  if (done) return null;

  return (
    <div
      data-boot-splash
      className={cn(
        "fixed inset-0 z-[200] overflow-hidden transition-opacity duration-300",
        snapshot ? "pointer-events-none" : "bg-[#08090d]",
        fading && "opacity-0",
      )}
      onTransitionEnd={finishFade}
    >
      {!snapshot && (
        <>
          <BootSlogan />
          {enabled && (
            <div
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                canvas ? "opacity-100" : "opacity-0",
              )}
            >
              <Suspense fallback={null}>
                <VersusScene lite={lite} onFirstFrame={setCanvas} />
              </Suspense>
            </div>
          )}
        </>
      )}
      {snapshot && !shatterPainted && <FreezeFrame frame={snapshot} />}
      {snapshot && (
        <Suspense fallback={null}>
          <IceShatter3D
            snapshot={snapshot}
            lite={lite}
            onFirstFrame={() => setShatterPainted(true)}
            onDone={() => setDone(true)}
          />
        </Suspense>
      )}
      <BootSplashHud leaving={ready} fighting={canvas !== null} />
    </div>
  );
}
