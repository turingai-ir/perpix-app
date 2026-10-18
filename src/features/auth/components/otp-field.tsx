import type { FC } from "react";

import { AuthField } from "./auth-field";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

const OTP_SLOTS = [0, 1, 2, 3, 4, 5] as const;

export const OtpField: FC = () => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);

  return (
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
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
      )}
    </AuthField>
  );
};
