import { useRef, type FC } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import { AuthField } from "./auth-field";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

gsap.registerPlugin(useGSAP);

const OTP_SLOTS = [0, 1, 2, 3, 4, 5] as const;

export const OtpField: FC = () => {
  const scope = useRef<HTMLDivElement>(null);
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.fromTo(
        "[data-otp-slot]",
        { y: 18, rotation: -8, scale: 0.72, opacity: 0 },
        {
          y: 0,
          rotation: 0,
          scale: 1,
          opacity: 1,
          duration: 0.55,
          stagger: 0.075,
          ease: "back.out(1.9)",
        },
      );
    },
    { scope },
  );

  return (
    <div ref={scope}>
      <AuthField name="otp_code" label={t("features.auth.complete.otpLabel")}>
        {(field) => (
          <InputOTP
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            {...field}
          >
            <InputOTPGroup dir="ltr">
              {OTP_SLOTS.map((index) => (
                <InputOTPSlot key={index} index={index} data-otp-slot />
              ))}
            </InputOTPGroup>
          </InputOTP>
        )}
      </AuthField>
    </div>
  );
};
