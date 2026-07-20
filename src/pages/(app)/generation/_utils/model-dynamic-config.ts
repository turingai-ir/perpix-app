import type { UISchemaElement } from "@jsonforms/core";

import type { JsonConfigMeta } from "@/hooks/use-dynamic-config-form";

type ModelDynamicConfig = {
  configDefaults?: Record<string, unknown>;
  configMeta: JsonConfigMeta | null;
};

export function getModelDynamicConfig(model: unknown): ModelDynamicConfig {
  if (!model || typeof model !== "object") {
    return {
      configDefaults: undefined,
      configMeta: null,
    };
  }

  const modelRecord = model as {
    config_defaults?: Record<string, unknown>;
    meta?: JsonConfigMeta | null;
  };

  return {
    configDefaults: modelRecord.config_defaults,
    configMeta: modelRecord.meta ?? null,
  };
}

export function getGenerationConfigMeta(
  uiSchema: Readonly<Record<string, unknown>> | undefined,
): JsonConfigMeta | null {
  if (!isUiSchemaElement(uiSchema)) return null;

  return { uischema: uiSchema };
}

function isUiSchemaElement(
  uiSchema: Readonly<Record<string, unknown>> | undefined,
): uiSchema is Readonly<Record<string, unknown>> & UISchemaElement {
  return typeof uiSchema?.type === "string";
}
