import type { FC } from "react";
import { LoaderCircle } from "lucide-react";

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
    {isPending ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
    {label}
    {lockedSeconds > 0 ? ` (${lockedSeconds})` : null}
  </Button>
);
