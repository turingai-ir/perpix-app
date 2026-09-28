import { useState, type PointerEvent } from "react";
import { Pause, Play, Sparkles } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { useAppTranslate } from "@/hooks";

export function FinanceArt({ variant }: { variant: "payments" | "wallet" }) {
  const { t } = useAppTranslate();
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 160, damping: 24 });
  const springY = useSpring(y, { stiffness: 160, damping: 24 });
  const transform = useTransform(
    [springX, springY],
    ([rx, ry]) => `rotateX(${rx}deg) rotateY(${ry}deg)`,
  );

  function tilt(event: PointerEvent<HTMLDivElement>) {
    if (
      reduced ||
      paused ||
      event.pointerType !== "mouse" ||
      !matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const bounds = event.currentTarget.getBoundingClientRect();
    x.set(((event.clientY - bounds.top) / bounds.height - 0.5) * -14);
    y.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 18);
  }

  return (
    <div
      className={`finance-art finance-art--${variant}`}
      data-paused={paused || !!reduced}
    >
      <div
        className="finance-art-hitbox"
        onPointerMove={tilt}
        onPointerLeave={() => {
          x.set(0);
          y.set(0);
        }}
      >
        <motion.div
          className="finance-art-scene"
          style={{ transform: reduced || paused ? "none" : transform }}
          aria-hidden="true"
        >
          <div className="finance-orbit finance-orbit--one" />
          <div className="finance-orbit finance-orbit--two" />
          <div className="finance-art-platform" />
          <div className="finance-glass-pass">
            <div className="finance-pass-top">
              <span>PERPIX</span>
              <Sparkles size={17} />
            </div>
            <div className="finance-pass-lines">
              <i />
              <i />
              <i />
            </div>
            <div className="finance-pass-bottom">
              <span>
                {t(
                  variant === "payments"
                    ? "pages.profile.finance.paymentArt"
                    : "pages.profile.finance.walletArt",
                )}
              </span>
              <span>✦</span>
            </div>
          </div>
          <div className="finance-emblem">
            <div className="finance-emblem-face">
              <img
                src="/android-chrome-512x512.png"
                alt=""
                width={112}
                height={112}
                draggable={false}
              />
            </div>
          </div>
          <div className="finance-art-spark finance-art-spark--one">✦</div>
          <div className="finance-art-spark finance-art-spark--two">✦</div>
        </motion.div>
      </div>
      <div className="finance-art-caption">
        <span>
          {t(
            variant === "payments"
              ? "pages.profile.finance.paymentArt"
              : "pages.profile.finance.walletArt",
          )}
        </span>
        {!reduced && (
          <button
            type="button"
            className="finance-motion-toggle"
            aria-label={t(
              paused
                ? "pages.profile.finance.resumeMotion"
                : "pages.profile.finance.pauseMotion",
            )}
            onClick={() => setPaused(!paused)}
          >
            {paused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
          </button>
        )}
      </div>
    </div>
  );
}
