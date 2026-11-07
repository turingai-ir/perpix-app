import { useState, type FC } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useAppTranslate } from "@/shared/hooks";
import { APP_I18_KEYS } from "@/shared/i18n";

import type { AuthChallenge, ChallengePurpose } from "../model/types";
import { usePasswordResetChallengeMutation } from "../hooks/use-auth-mutations";

import { ChallengeCompleteForm } from "./challenge-complete-form";
import { ChallengeStartForm } from "./challenge-start-form";
import { LoginForm } from "./login-form";
import { AuthProgress } from "./auth-progress";

type FlowView =
  | { name: "phone"; phone: string }
  | { name: "login"; phone: string }
  | {
      name: "complete";
      purpose: ChallengePurpose;
      phone: string;
      challenge: AuthChallenge;
    };

export const AuthFlow: FC<{ onAuthenticated: () => Promise<void> }> = ({
  onAuthenticated,
}) => {
  const [view, setView] = useState<FlowView>({ name: "phone", phone: "" });
  const reset = usePasswordResetChallengeMutation();
  const reduceMotion = useReducedMotion();
  const step = view.name === "complete" ? view.purpose : view.name;
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const isFirstStep = view.name === "phone";
  let nextLabel = t("pages.auth.login.visual.stepAccess");
  if (view.name === "complete") {
    nextLabel = t(
      view.purpose === "registration"
        ? "pages.auth.login.visual.stepRegister"
        : "pages.auth.login.visual.stepReset",
    );
  }

  return (
    <div className="w-full">
      <AuthProgress
        label={t("pages.auth.login.visual.progressLabel")}
        firstStep={{
          badge: "01",
          text: t("pages.auth.login.visual.stepPhone"),
        }}
        secondStep={{ badge: "02", text: nextLabel }}
        isFirstStep={isFirstStep}
      />
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          data-auth-step={step}
          className="w-full"
          initial={
            reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(6px)" }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={
            reduceMotion
              ? undefined
              : { opacity: 0, y: -10, filter: "blur(4px)" }
          }
          transition={{
            duration: reduceMotion ? 0 : 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
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
              onAuthenticated={onAuthenticated}
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
              onAuthenticated={onAuthenticated}
              phone={view.phone}
              challenge={view.challenge}
              onChallenge={(challenge) => setView({ ...view, challenge })}
              onPasswordReset={() =>
                setView({ name: "login", phone: view.phone })
              }
              onBack={() => setView({ name: "phone", phone: view.phone })}
            />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
