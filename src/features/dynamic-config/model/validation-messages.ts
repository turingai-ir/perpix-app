import { type TFunction } from "i18next";
import { type DynamicConfigValidationMessages } from "./form-types";

const DYNAMIC_CONFIG_VALIDATION_KEY = "common.validationErrors.dynamicConfig";

export const DEFAULT_VALIDATION_MESSAGES: DynamicConfigValidationMessages = {
  required: "This field is required",
  invalidEnum: "The selected value is invalid",
  invalidString: "Value must be a string",
  invalidNumber: "Value must be a number",
  invalidInteger: "Value must be an integer",
  invalidArray: "Value must be an array",
  minLength: (min) => `At least ${min} characters are required`,
  maxLength: (max) => `At most ${max} characters are allowed`,
  minNumber: (min) => `Minimum value is ${min}`,
  maxNumber: (max) => `Maximum value is ${max}`,
  minItems: (min) => `At least ${min} items are required`,
  maxItems: (max) => `At most ${max} items are allowed`,
};

export function createValidationMessages(
  t: TFunction,
): DynamicConfigValidationMessages {
  return {
    required: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.required`),
    invalidEnum: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidEnum`),
    invalidString: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidString`),
    invalidNumber: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidNumber`),
    invalidInteger: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidInteger`),
    invalidArray: t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.invalidArray`),
    minLength: (min) =>
      t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.minLength`, { min }),
    maxLength: (max) =>
      t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.maxLength`, { max }),
    minNumber: (min) =>
      t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.minNumber`, { min }),
    maxNumber: (max) =>
      t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.maxNumber`, { max }),
    minItems: (min) => t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.minItems`, { min }),
    maxItems: (max) => t(`${DYNAMIC_CONFIG_VALIDATION_KEY}.maxItems`, { max }),
  };
}
