import type { FC } from "react";
import { ArrowLeft, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export const FormAlert: FC<{ message: string | null }> = ({ message }) =>
  message ? (
    <p role="alert" className="text-destructive text-sm">
      {message}
    </p>
  ) : null;

interface SubmitButtonProps {
  label: string;
  isPending: boolean;
  lockedSeconds?: number;
}

export const SubmitButton: FC<SubmitButtonProps> = ({
  label,
  isPending,
  lockedSeconds = 0,
}) => (
  <Button
    className="w-full"
    type="submit"
    disabled={isPending || lockedSeconds > 0}
  >
    <span>
      {label}
      {lockedSeconds > 0 ? ` (${lockedSeconds})` : null}
    </span>
    <span aria-hidden="true" data-auth-submit-icon="">
      {isPending ? <LoaderCircle className="animate-spin" /> : <ArrowLeft />}
    </span>
  </Button>
);
