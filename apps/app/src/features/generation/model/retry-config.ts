import {
  sanitizeConfigValues,
  type JsonConfigSchema,
} from "@/features/dynamic-config/model";
import { getModelDynamicConfig } from "@/features/generation/model/model-dynamic-config";
import type { SchemaAiTaskMessageResponse } from "@/shared/api";

// Added by the server to stored configs; never part of a user request.
const SERVER_OUTPUT_FIELDS = [
  "images_generated",
  "videos_generated",
  "include_cost",
];

type Config = Readonly<Record<string, unknown>>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasValue(value: unknown) {
  if (value === undefined || value === null || value === "") return false;
  return !Array.isArray(value) || value.length > 0;
}

function withoutOutputFields(config: Config | null | undefined) {
  return Object.fromEntries(
    Object.entries(config ?? {}).filter(
      ([key]) => !SERVER_OUTPUT_FIELDS.includes(key),
    ),
  );
}

/**
 * The server may keep the request inputs on the USER message, the ASSISTANT
 * message or both. Merge them so a retry or continuation keeps every input
 * (reference images, frames, ratios…) instead of only the prompt.
 */
export function mergeRequestConfig(
  assistantConfig: Config | null | undefined,
  requestConfig: Config | null | undefined,
): Record<string, unknown> {
  const merged: Record<string, unknown> = withoutOutputFields(assistantConfig);
  for (const [key, value] of Object.entries(
    withoutOutputFields(requestConfig),
  )) {
    if (hasValue(value) || !(key in merged)) merged[key] = value;
  }
  return merged;
}

/**
 * The backend stores the mode's canonical config, which never contains
 * `mode` (it is stripped by the mode schema). Without it the form falls back
 * to the first mode (e.g. text-to-image) and drops inputs such as references.
 * Mirrors the backend's `resolve_mode`: the first mode whose fields contain
 * every stored input and whose required fields are present or defaulted.
 */
export function withInferredMode(
  config: Config,
  configSchema: JsonConfigSchema | null | undefined,
): Record<string, unknown> {
  if (hasValue(config.mode) || !configSchema?.allOf) return { ...config };

  const knownFields = configSchema.properties ?? {};
  const inputKeys = Object.keys(config).filter(
    (key) => key !== "mode" && key in knownFields && hasValue(config[key]),
  );
  for (const rule of configSchema.allOf) {
    if (!isRecord(rule) || !isRecord(rule.if) || !isRecord(rule.then)) continue;
    const modeProp = isRecord(rule.if.properties)
      ? rule.if.properties.mode
      : undefined;
    const fields = rule.then.properties;
    if (!isRecord(modeProp) || !isRecord(fields)) continue;
    if (!inputKeys.every((key) => key in fields)) continue;
    const required = Array.isArray(rule.then.required)
      ? rule.then.required
      : [];
    const hasRequired = required.every(
      (field) =>
        typeof field !== "string" ||
        inputKeys.includes(field) ||
        (isRecord(fields[field]) && "default" in fields[field]),
    );
    if (hasRequired) return { ...config, mode: modeProp.const };
  }
  return { ...config };
}

/**
 * Rebuilds the payload a normal form submit would send from the config the
 * server stored on a message: drops server-produced output fields and anything
 * the model schema does not accept, using the same sanitizer as the form.
 */
export function buildRetryConfig(
  storedConfig: Config,
  model: unknown,
): Record<string, unknown> {
  const inputConfig = withoutOutputFields(storedConfig);
  const { configSchema } = getModelDynamicConfig(model);

  if (!configSchema) return inputConfig;

  return sanitizeConfigValues(
    configSchema,
    withInferredMode(inputConfig, configSchema),
  );
}

type TaskMessage = Pick<
  SchemaAiTaskMessageResponse,
  "ai_model_config" | "ai_model_uuid" | "role" | "uuid"
>;

/**
 * Finds the USER request and ASSISTANT reply of one turn, starting from
 * either of them, so actions on a message see the whole request.
 */
export function findRequestPair<T extends TaskMessage>(
  messages: readonly T[],
  message: T,
): { assistant?: T; request?: T } {
  const index = messages.findIndex(({ uuid }) => uuid === message.uuid);
  if (message.role === "ASSISTANT") {
    const request = messages
      .slice(0, Math.max(index, 0))
      .reverse()
      .find(({ role }) => role === "USER");
    return { assistant: message, request };
  }
  const following = index < 0 ? [] : messages.slice(index + 1);
  const nextUser = following.findIndex(({ role }) => role === "USER");
  const assistant = (
    nextUser < 0 ? following : following.slice(0, nextUser)
  ).find(({ role }) => role === "ASSISTANT");
  return { assistant, request: message };
}

/** Full inputs and model of the turn a message belongs to. */
export function resolveRequest<T extends TaskMessage>(
  messages: readonly T[],
  message: T,
): { config: Record<string, unknown>; modelUuid?: string } {
  const { assistant, request } = findRequestPair(messages, message);
  return {
    config: mergeRequestConfig(
      assistant?.ai_model_config,
      request?.ai_model_config,
    ),
    modelUuid:
      message.ai_model_uuid ??
      assistant?.ai_model_uuid ??
      request?.ai_model_uuid ??
      undefined,
  };
}
