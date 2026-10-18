import { useState, type FC } from "react";

import type { AuthChallenge, ChallengePurpose } from "../model/types";

import { ChallengeCompleteForm } from "./challenge-complete-form";
import { ChallengeStartForm } from "./challenge-start-form";
import { LoginForm } from "./login-form";

type FlowView =
  | { name: "login" }
  | { name: "start"; purpose: ChallengePurpose }
  | {
      name: "complete";
      purpose: ChallengePurpose;
      phone: string;
      challenge: AuthChallenge;
    };

export const AuthFlow: FC = () => {
  const [view, setView] = useState<FlowView>({ name: "login" });
  const toLogin = () => setView({ name: "login" });

  return (
    <main className="grid h-dvh w-full place-items-center p-4">
      {view.name === "login" ? (
        <LoginForm
          onForgotPassword={() =>
            setView({ name: "start", purpose: "password-reset" })
          }
          onCreateAccount={() =>
            setView({ name: "start", purpose: "registration" })
          }
        />
      ) : null}
      {view.name === "start" ? (
        <ChallengeStartForm
          purpose={view.purpose}
          onBackToLogin={toLogin}
          onChallenge={(phone, challenge) =>
            setView({
              name: "complete",
              purpose: view.purpose,
              phone,
              challenge,
            })
          }
        />
      ) : null}
      {view.name === "complete" ? (
        <ChallengeCompleteForm
          purpose={view.purpose}
          phone={view.phone}
          challenge={view.challenge}
          onChallenge={(challenge) => setView({ ...view, challenge })}
          onPasswordReset={toLogin}
          onBack={() => setView({ name: "start", purpose: view.purpose })}
        />
      ) : null}
    </main>
  );
};
