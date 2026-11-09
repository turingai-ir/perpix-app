import type { FC } from "react";
import { BadgeCheck, RotateCcw, Sparkles } from "lucide-react";
import { motion } from "motion/react";

import styles from "./identity-card.module.css";
import { useIdentityCard, type UseIdentityCardProps } from "../../hooks/use-identity-card";

export type IdentityCardProps = UseIdentityCardProps;

export const IdentityCard: FC<IdentityCardProps> = ({ user, displayName }) => {
  const {
    t,
    reduceMotion,
    isFlipped,
    surfaceRef,
    tilt,
    light,
    memberSince,
    memberCode,
    isVerified,
    handlePointerMove,
    resetPointer,
    toggleFlip,
  } = useIdentityCard({ user, displayName });

  return (
    <div className={styles.cardStage}>
      <motion.div
        className={styles.cardTilt}
        style={reduceMotion ? undefined : { transform: tilt }}
      >
        <button
          ref={surfaceRef}
          type="button"
          className={styles.cardButton}
          data-testid="identity-card"
          data-side={isFlipped ? "back" : "front"}
          aria-label={t(
            isFlipped
              ? "pages.profile.settings.cardShowFront"
              : "pages.profile.settings.cardShowBack",
          )}
          aria-describedby={isFlipped ? styles.cardBackDetails : undefined}
          aria-pressed={isFlipped}
          onClick={toggleFlip}
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          onBlur={resetPointer}
        >
          <span className={styles.cardRotor} data-card="rotor">
            <span className={`${styles.cardFace} ${styles.cardFront}`}>
              <motion.span
                className={styles.cardLight}
                style={reduceMotion ? undefined : { transform: light }}
                aria-hidden="true"
              />
              <span className={styles.cardNoise} aria-hidden="true" />
              <span className={styles.cardHeader}>
                <span className={styles.cardBrand}>
                  PERPIX <i>✦</i>
                </span>
                <span className={styles.cardEdition}>
                  {t("pages.profile.settings.cardEdition")}
                </span>
              </span>
              <span className={styles.cardCore} aria-hidden="true">
                <span
                  className={`${styles.cardOrbit} ${styles.cardOrbitOne}`}
                />
                <span
                  className={`${styles.cardOrbit} ${styles.cardOrbitTwo}`}
                />
                <span className={styles.cardEmblem} data-card="emblem">
                  <img
                    src="/android-chrome-512x512.png"
                    alt=""
                    draggable={false}
                  />
                </span>
              </span>
              <span className={styles.cardFooter}>
                <span className={styles.cardOwner}>
                  <small>{t("pages.profile.settings.cardOwner")}</small>
                  <strong>{displayName}</strong>
                </span>
                <span className={styles.cardMember}>
                  {t("pages.profile.settings.cardMember")}
                  <span className={styles.cardMemberDot} />
                </span>
              </span>
              <span className={styles.cardFlipHint} aria-hidden="true">
                <RotateCcw size={12} />
                {t("pages.profile.settings.cardFlipHint")}
              </span>
            </span>
            <span
              className={`${styles.cardFace} ${styles.cardBack}`}
              data-card="back"
            >
              <span className={styles.cardBackHalo} aria-hidden="true" />
              <span className={styles.cardHeader}>
                <span className={styles.cardBrand}>
                  PERPIX <i>✦</i>
                </span>
                <span className={styles.cardEdition}>
                  {t("pages.profile.settings.cardBackEdition")}
                </span>
              </span>
              <span className={styles.cardBackCenter} data-card="back-center">
                <span className={styles.cardBackIcon}>
                  <Sparkles size={20} aria-hidden="true" />
                </span>
                <strong>{t("pages.profile.settings.cardBackTitle")}</strong>
                <small>{t("pages.profile.settings.cardBackDescription")}</small>
              </span>
              <span
                className={styles.cardBackDetails}
                data-card="back-details"
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
                <span className={styles.cardBackStatus}>
                  <BadgeCheck size={13} aria-hidden="true" />
                  {t(
                    isVerified
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
};
