import { sanitizeConfigValues } from "@/hooks/use-dynamic-config-form";
import { getModelDynamicConfig } from "@/pages/(app)/generation/_utils/model-dynamic-config";

const SERVER_OUTPUT_FIELDS = ["images_generated", "videos_generated"];

/**
 * Rebuilds the payload a normal form submit would send from the config the
 * server stored on a message: drops server-produced output fields and anything
 * the model schema does not accept, using the same sanitizer as the form.
 */
export function buildRetryConfig(
  storedConfig: Readonly<Record<string, unknown>>,
  model: unknown,
): Record<string, unknown> {
  const inputConfig = Object.fromEntries(
    Object.entries(storedConfig).filter(
      ([key]) => !SERVER_OUTPUT_FIELDS.includes(key),
    ),
  );
  const { configSchema } = getModelDynamicConfig(model);

  if (!configSchema) return inputConfig;

  return sanitizeConfigValues(configSchema, inputConfig);
}
