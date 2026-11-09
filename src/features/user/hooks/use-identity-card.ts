import { useRef, useState, type PointerEvent } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

export interface UseIdentityCardProps {
  user: { phone_number: string; is_verified: boolean; created_at: string };
  displayName: string;
}

export function useIdentityCard({ user, displayName }: UseIdentityCardProps) {
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

  const handlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (
      reduceMotion ||
      event.pointerType !== "mouse" ||
      !window.matchMedia("(hover: hover) and (pointer: fine)").matches
    ) {
      return;
    }
    const bounds = surfaceRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    rotateX.set(y * -12);
    rotateY.set(x * 12);
    lightX.set(x * 150);
    lightY.set(y * 120);
  };

  const resetPointer = () => {
    rotateX.set(0);
    rotateY.set(0);
    lightX.set(0);
    lightY.set(0);
  };

  const toggleFlip = () => {
    setIsFlipped((value) => !value);
  };

  return {
    t,
    displayName,
    reduceMotion,
    isFlipped,
    surfaceRef,
    tilt,
    light,
    memberSince,
    memberCode,
    isVerified: user.is_verified,
    handlePointerMove,
    resetPointer,
    toggleFlip,
  };
}
