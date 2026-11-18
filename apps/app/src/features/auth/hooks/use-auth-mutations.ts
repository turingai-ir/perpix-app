import { useMutation } from "@tanstack/react-query";

import * as authHttp from "../services/auth-http";
import * as sessionManager from "../services/session-manager";
import { sessionStore } from "../services/session-store";

// Auth requests must fail visibly instead of pausing while offline.
const AUTH_MUTATION_OPTIONS = { networkMode: "always" } as const;

export const useLoginMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    mutationFn: async (body: { phone_number: string; password: string }) => {
      const cycle = sessionStore.getCycle();
      sessionManager.startSession(await authHttp.login(body), cycle);
    },
  });

export const usePasswordResetChallengeMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    mutationFn: authHttp.requestPasswordResetChallenge,
  });

export const useResendChallengeMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    mutationFn: authHttp.resendChallenge,
  });

export const useCompleteRegistrationMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    mutationFn: async (body: {
      challenge_id: string;
      otp_code: string;
      password: string;
    }) => {
      const cycle = sessionStore.getCycle();
      sessionManager.startSession(
        await authHttp.completeRegistration(body),
        cycle,
      );
    },
  });

export const useCompletePasswordResetMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    mutationFn: sessionManager.completePasswordReset,
  });

export const useChangePasswordMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    mutationFn: sessionManager.changePassword,
  });

export const useSignOutMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    mutationFn: (cycle: number) => sessionManager.signOut(cycle),
  });

export const useSignOutEverywhereMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    mutationFn: sessionManager.signOutEverywhere,
  });

export const useStartAuthMutation = () =>
  useMutation({
    ...AUTH_MUTATION_OPTIONS,
    retry: false,
    mutationFn: authHttp.startAuth,
  });
