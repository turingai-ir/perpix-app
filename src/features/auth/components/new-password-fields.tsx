import type { FC } from "react";

import { AuthField } from "./auth-field";

import { PasswordInput } from "@/components/ui/password-input";

interface NewPasswordFieldsProps {
  passwordName: string;
  passwordLabel: string;
  confirmLabel: string;
  hint: string;
}

export const NewPasswordFields: FC<NewPasswordFieldsProps> = ({
  passwordName,
  passwordLabel,
  confirmLabel,
  hint,
}) => (
  <>
    <AuthField name={passwordName} label={passwordLabel} hint={hint}>
      {(field) => (
        <PasswordInput dir="ltr" autoComplete="new-password" {...field} />
      )}
    </AuthField>
    <AuthField name="confirm_password" label={confirmLabel}>
      {(field) => (
        <PasswordInput dir="ltr" autoComplete="new-password" {...field} />
      )}
    </AuthField>
  </>
);
