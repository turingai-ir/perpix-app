export const REGEX = {
  mobile: /^09\d{9}$/,
  password: /^(?=.{8,128}$)(?=.*[a-z])(?=.*[A-Z]).*$/,
  number: /^[0-9]+$/,
} as const;
