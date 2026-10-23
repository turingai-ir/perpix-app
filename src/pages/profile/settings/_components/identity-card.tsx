import { useRef, useState, type PointerEvent } from "react";
import { BadgeCheck, RotateCcw, Sparkles } from "lucide-react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

type IdentityCardProps = {
  user: { phone_number: string; is_verified: boolean; created_at: string };
  displayName: string;
};

export function IdentityCard({ user, displayName }: IdentityCardProps) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const reduceMotion = useReducedMotion();
  const [isFlipped, setIsFlipped] = useState(false);
  const surfaceRef = useRef<HTMLButtonElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const lightX = useMotionValue(0);
  const lightY = useMotionValue(0);
  const smoothX = useSpring(rotateX, { stiffness: 160, damping: 22 });
  const smoothY = useSpring(rotateY, { stiffness: 160, damping: 22 });
  const smoothLightX = useSpring(lightX, { stiffness: 160, damping: 22 });
  const smoothLightY = useSpring(lightY, { stiffness: 160, damping: 22 });
  const tilt = useTransform(
    [smoothX, smoothY],
    ([x, y]) => `rotateX(${x}deg) rotateY(${y}deg)`,
  );
  const light = useTransform(
    [smoothLightX, smoothLightY],
    ([x, y]) => `translate3d(${x}px, ${y}px, 0)`,
  );
  const validDate = new Date(user.created_at);
  const memberSince = Number.isNaN(validDate.getTime())
    ? "—"
    : new Intl.DateTimeFormat("fa-IR", {
        year: "numeric",
        month: "long",
      }).format(validDate);
  const memberCode = user.phone_number.slice(-4);

  function handlePointerMove(event: PointerEvent<HTMLButtonElement>) {
    if (
      reduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    )
      return;
    const bounds = surfaceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(y * -12);
    rotateY.set(x * 12);
    lightX.set(x * 150);
    lightY.set(y * 120);
  }

  function resetPointer() {
    rotateX.set(0);
    rotateY.set(0);
    lightX.set(0);
    lightY.set(0);
  }

  return (
    <div className="settings-card-stage">
      <motion.div
        className="settings-card-tilt"
        style={reduceMotion ? undefined : { transform: tilt }}
      >
        <button
          ref={surfaceRef}
          type="button"
          className="settings-card-button"
          data-testid="identity-card"
          data-side={isFlipped ? "back" : "front"}
          aria-label={t(
            isFlipped
              ? "pages.profile.settings.cardShowFront"
              : "pages.profile.settings.cardShowBack",
          )}
          aria-describedby={
            isFlipped ? "settings-card-back-details" : undefined
          }
          aria-pressed={isFlipped}
          onClick={() => setIsFlipped((value) => !value)}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          onBlur={resetPointer}
        >
          <span className="settings-card-rotor">
            <span className="settings-card-face settings-card-front">
              <motion.span
                className="settings-card-light"
                style={reduceMotion ? undefined : { transform: light }}
                aria-hidden="true"
              />
              <span className="settings-card-noise" aria-hidden="true" />
              <span className="settings-card-header">
                <span className="settings-card-brand">
                  PERPIX <i>✦</i>
                </span>
                <span className="settings-card-edition">
                  {t("pages.profile.settings.cardEdition")}
                </span>
              </span>
              <span className="settings-card-core" aria-hidden="true">
                <span className="settings-card-orbit settings-card-orbit-one" />
                <span className="settings-card-orbit settings-card-orbit-two" />
                <span className="settings-card-emblem">
                  <img
                    src="/android-chrome-512x512.png"
                    alt=""
                    draggable={false}
                  />
                </span>
              </span>
              <span className="settings-card-footer">
                <span className="settings-card-owner">
                  <small>{t("pages.profile.settings.cardOwner")}</small>
                  <strong>{displayName}</strong>
                </span>
                <span className="settings-card-member">
                  {t("pages.profile.settings.cardMember")}
                  <span className="settings-card-member-dot" />
                </span>
              </span>
              <span className="settings-card-flip-hint" aria-hidden="true">
                <RotateCcw size={12} />
                {t("pages.profile.settings.cardFlipHint")}
              </span>
            </span>
            <span className="settings-card-face settings-card-back">
              <span className="settings-card-back-halo" aria-hidden="true" />
              <span className="settings-card-header">
                <span className="settings-card-brand">
                  PERPIX <i>✦</i>
                </span>
                <span className="settings-card-edition">
                  {t("pages.profile.settings.cardBackEdition")}
                </span>
              </span>
              <span className="settings-card-back-center">
                <span className="settings-card-back-icon">
                  <Sparkles size={20} aria-hidden="true" />
                </span>
                <strong>{t("pages.profile.settings.cardBackTitle")}</strong>
                <small>{t("pages.profile.settings.cardBackDescription")}</small>
              </span>
              <span
                className="settings-card-back-details"
                id="settings-card-back-details"
              >
                <span>
                  <small>{t("pages.profile.settings.cardSince")}</small>
                  <strong>{memberSince}</strong>
                </span>
                <span>
                  <small>{t("pages.profile.settings.cardPhone")}</small>
                  <strong dir="ltr">••• ••• {memberCode}</strong>
                </span>
                <span className="settings-card-back-status">
                  <BadgeCheck size={13} aria-hidden="true" />
                  {t(
                    user.is_verified
                      ? "pages.profile.settings.verified"
                      : "pages.profile.settings.cardUnverified",
                  )}
                </span>
              </span>
            </span>
          </span>
        </button>
      </motion.div>
    </div>
  );
}
