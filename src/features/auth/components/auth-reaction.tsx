import { useRef, type FC } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";


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
      className="pointer-events-none absolute inset-0 z-[5] overflow-hidden rounded-3xl motion-reduce:hidden"
      data-auth-reaction={kind}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-primary opacity-0" data-reaction-flash />
      <div className="absolute inset-y-0 start-0 w-1/2 [clip-path:polygon(0_0,100%_0,89%_30%,100%_58%,90%_100%,0_100%)] bg-[linear-gradient(145deg,var(--accent),var(--background)_80%)] shadow-[0_0_32px] shadow-primary/60" data-reaction-left />
      <div className="absolute inset-y-0 end-0 w-1/2 [clip-path:polygon(10%_0,100%_0,100%_100%,0_100%,10%_64%,0_30%)] bg-[linear-gradient(145deg,var(--accent),var(--background)_80%)] shadow-[0_0_32px] shadow-primary/60" data-reaction-right />
      <svg className="absolute start-[calc(50%-44px)] top-[12%] h-[150px] w-[88px] text-primary drop-shadow-[0_0_13px_var(--primary)]" viewBox="0 0 100 180" fill="none">
        <path
          data-reaction-bolt
          d="M59 3 24 77h29L35 177l44-91H49L59 3Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeDasharray="180"
        />
      </svg>
      <span className="absolute inset-x-3.5 bottom-[18%] m-auto w-fit max-w-[calc(100%-28px)] rounded-full border border-primary bg-popover px-[18px] py-2.5 text-center font-bold text-popover-foreground shadow-[0_8px_32px] shadow-primary/40" data-reaction-caption>
        {message}
      </span>
    </div>
  );
};
