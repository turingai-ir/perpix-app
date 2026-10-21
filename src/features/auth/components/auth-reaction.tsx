import { useRef, type FC } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import styles from "./auth-reaction.module.css";

gsap.registerPlugin(useGSAP);

interface AuthReactionProps {
  kind: "password" | "code";
  message: string;
}

export const AuthReaction: FC<AuthReactionProps> = ({ kind, message }) => {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const timeline = gsap.timeline();
      timeline
        .fromTo(
          "[data-reaction-flash]",
          { opacity: 0 },
          { opacity: 1, duration: 0.07, repeat: 3, yoyo: true },
        )
        .fromTo(
          "[data-reaction-bolt]",
          { strokeDashoffset: 180, opacity: 1 },
          { strokeDashoffset: 0, duration: 0.28, ease: "power4.in" },
          0.05,
        )
        .fromTo(
          "[data-reaction-left]",
          { xPercent: 0, opacity: 0.94 },
          { xPercent: -105, opacity: 0, duration: 0.54, ease: "power3.out" },
          0.22,
        )
        .fromTo(
          "[data-reaction-right]",
          { xPercent: 0, opacity: 0.94 },
          { xPercent: 105, opacity: 0, duration: 0.54, ease: "power3.out" },
          0.22,
        )
        .fromTo(
          "[data-reaction-caption]",
          { y: 18, scale: 0.8, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.38, ease: "back.out(1.8)" },
          0.3,
        )
        .to(scope.current, { opacity: 0, duration: 0.24 }, "+=0.75");
    },
    { scope },
  );

  return (
    <div
      ref={scope}
      className={styles.scene}
      data-auth-reaction={kind}
      aria-hidden="true"
    >
      <div className={styles.flash} data-reaction-flash />
      <div className={styles.left} data-reaction-left />
      <div className={styles.right} data-reaction-right />
      <svg className={styles.bolt} viewBox="0 0 100 180" fill="none">
        <path
          data-reaction-bolt
          d="M59 3 24 77h29L35 177l44-91H49L59 3Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeDasharray="180"
        />
      </svg>
      <span className={styles.caption} data-reaction-caption>
        {message}
      </span>
    </div>
  );
};
