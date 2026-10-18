import { z } from "zod";

import { toCanonicalIranMobile, toLatinDigits } from "./phone";

export interface AuthFormMessages {
  phone: string;
  otp: string;
  passwordRequired: string;
  newPasswordLength: string;
  passwordMismatch: string;
}

const NEW_PASSWORD_MIN = 8;
const NEW_PASSWORD_MAX = 128;
const CURRENT_PASSWORD_MAX = 1024;

const phoneField = (messages: AuthFormMessages) =>
  z
    .string()
    .transform((value) => toCanonicalIranMobile(value) ?? "")
    .refine((value) => value !== "", messages.phone);

const newPasswordField = (messages: AuthFormMessages) =>
  z
    .string()
    .min(NEW_PASSWORD_MIN, messages.newPasswordLength)
    .max(NEW_PASSWORD_MAX, messages.newPasswordLength);

const existingPasswordField = (messages: AuthFormMessages) =>
  z
    .string()
    .min(1, messages.passwordRequired)
    .max(CURRENT_PASSWORD_MAX, messages.passwordRequired);

const otpField = (messages: AuthFormMessages) =>
  z
    .string()
    .transform(toLatinDigits)
    .refine((value) => /^\d{6}$/.test(value), messages.otp);

export const createLoginSchema = (messages: AuthFormMessages) =>
  z.object({
    phone_number: phoneField(messages),
    password: existingPasswordField(messages),
  });

export const createPhoneSchema = (messages: AuthFormMessages) =>
  z.object({ phone_number: phoneField(messages) });

export const createCompleteChallengeSchema = (messages: AuthFormMessages) =>
  z
    .object({
      otp_code: otpField(messages),
      password: newPasswordField(messages),
      confirm_password: z.string(),
    })
    .refine((value) => value.password === value.confirm_password, {
      path: ["confirm_password"],
      message: messages.passwordMismatch,
    });

export const createChangePasswordSchema = (messages: AuthFormMessages) =>
  z
    .object({
      current_password: existingPasswordField(messages),
      new_password: newPasswordField(messages),
      confirm_password: z.string(),
    })
    .refine((value) => value.new_password === value.confirm_password, {
      path: ["confirm_password"],
      message: messages.passwordMismatch,
    });
