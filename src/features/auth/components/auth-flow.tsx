import { useState, type FC } from "react";

import type { AuthChallenge, ChallengePurpose } from "../model/types";
import { usePasswordResetChallengeMutation } from "../hooks/use-auth-mutations";

import { ChallengeCompleteForm } from "./challenge-complete-form";
import { ChallengeStartForm } from "./challenge-start-form";
import { LoginForm } from "./login-form";

type FlowView =
  | { name: "phone"; phone: string }
  | { name: "login"; phone: string }
  | {
      name: "complete";
      purpose: ChallengePurpose;
      phone: string;
      challenge: AuthChallenge;
    };

export const AuthFlow: FC = () => {
  const [view, setView] = useState<FlowView>({ name: "phone", phone: "" });
  const reset = usePasswordResetChallengeMutation();

  return (
    <main className="grid min-h-dvh w-full place-items-center p-4">
      {view.name === "phone" ? (
        <ChallengeStartForm
          phone={view.phone}
          onStart={(phone, result) => {
            if (result.next_step === "password") {
              setView({ name: "login", phone });
            } else {
              setView({
                name: "complete",
                purpose: "registration",
                phone,
                challenge: result,
              });
            }
          }}
        />
      ) : null}
      {view.name === "login" ? (
        <LoginForm
          phone={view.phone}
          isResetPending={reset.isPending}
          onBack={() => setView({ name: "phone", phone: view.phone })}
          onForgotPassword={async () => {
            const challenge = await reset.mutateAsync(view.phone);
            setView({
              name: "complete",
              purpose: "password-reset",
              phone: view.phone,
              challenge,
            });
          }}
        />
      ) : null}
      {view.name === "complete" ? (
        <ChallengeCompleteForm
          purpose={view.purpose}
          phone={view.phone}
          challenge={view.challenge}
          onChallenge={(challenge) => setView({ ...view, challenge })}
          onPasswordReset={() => setView({ name: "login", phone: view.phone })}
          onBack={() => setView({ name: "phone", phone: view.phone })}
        />
      ) : null}
    </main>
  );
};
