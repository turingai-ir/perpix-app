import type { UISchemaElement } from "@jsonforms/core";

import {
  isJsonConfigSchema,
  type JsonConfigMeta,
  type JsonConfigSchema,
  type JsonSchemaProperty,
} from "@/hooks/use-dynamic-config-form";

type ModeConfig = {
  config_schema: JsonConfigSchema;
  provider_uuid?: string;
  value: string;
};

type SelectorOption = {
  label?: string;
  order?: number;
  value: string;
};

type Selector = {
  label?: string;
  options?: SelectorOption[];
  widget?: string;
};

export type ModelDynamicConfig = {
  configDefaults?: Record<string, unknown>;
  configMeta: JsonConfigMeta | null;
  configSchema: JsonConfigSchema | null;
};

export function getModelDynamicConfig(model: unknown): ModelDynamicConfig {
  if (!isRecord(model)) return emptyModelDynamicConfig();

  const targetModel =
    isRecord(model.model) && isRecord(model.model.modes)
      ? model.model
      : isRecord(model.data) && isRecord(model.data.modes)
        ? model.data
        : model;

  const modes = getModes(targetModel.modes);
  if (modes.length === 0) return emptyModelDynamicConfig();

  const canonicalUiSchema = isRecord(targetModel.canonical_ui_schema)
    ? targetModel.canonical_ui_schema
    : {};
  const selector = getModeSelector(canonicalUiSchema.selectors);
  const orderedModes = orderModes(modes, selector);
  const modeValues = orderedModes.map(({ value }) => value);
  const defaultMode = modeValues[0];

  return {
    configDefaults: { mode: defaultMode },
    configMeta: buildConfigMeta(canonicalUiSchema.elements, selector),
    configSchema: buildCombinedModeSchema(
      orderedModes,
      modeValues,
      defaultMode,
    ),
  };
}

function buildCombinedModeSchema(
  modes: ModeConfig[],
  modeValues: string[],
  defaultMode: string,
): JsonConfigSchema {
  const defaultModeConfig = modes.find((m) => m.value === defaultMode);
  const otherModes = modes.filter((m) => m.value !== defaultMode);
  const orderedForMerge = [
    ...otherModes,
    ...(defaultModeConfig ? [defaultModeConfig] : []),
  ];

  const modeProperties = orderedForMerge.reduce<
    Record<string, JsonSchemaProperty>
  >((properties, mode) => {
    const merged = { ...properties };
    for (const [key, prop] of Object.entries(mode.config_schema.properties)) {
      if (!merged[key]) {
        merged[key] = { ...prop };
      } else {
        const existing = merged[key];
        const combinedEnum =
          Array.isArray(existing.enum) && Array.isArray(prop.enum)
            ? Array.from(new Set([...existing.enum, ...prop.enum]))
            : prop.enum ?? existing.enum;

        merged[key] = {
          ...existing,
          ...prop,
          default: prop.default ?? existing.default,
          enum: combinedEnum,
        };
      }
    }
    return merged;
  }, {});
  const allFieldNames = Object.keys(modeProperties);

  return {
    $id: modes
      .map(({ config_schema, value }) => config_schema.$id ?? value)
      .join(":"),
    type: "object",
    additionalProperties: false,
    required: ["mode"],
    properties: {
      ...modeProperties,
      mode: { type: "string", enum: modeValues, default: defaultMode },
    },
    allOf: modes.map((mode) => {
      const activeFieldNames = new Set(
        Object.keys(mode.config_schema.properties),
      );
      const inactiveFieldNames = allFieldNames.filter(
        (fieldName) => !activeFieldNames.has(fieldName),
      );
      const modeSchema = mode.config_schema as JsonConfigSchema &
        Record<string, unknown>;

      return {
        if: { properties: { mode: { const: mode.value } }, required: ["mode"] },
        then: {
          properties: mode.config_schema.properties,
          required: mode.config_schema.required,
          allOf: modeSchema.allOf,
          oneOf: modeSchema.oneOf,
          not: inactiveFieldNames.length
            ? {
                anyOf: inactiveFieldNames.map((name) => ({ required: [name] })),
              }
            : undefined,
        },
      };
    }),
  };
}

function buildConfigMeta(
  elements: unknown,
  selector: Selector | undefined,
): JsonConfigMeta {
  const optionLabels = Object.fromEntries(
    (selector?.options ?? []).map(({ label, value }) => [
      value,
      label ?? value,
    ]),
  );
  const modeControl = {
    type: "Control",
    scope: "#/properties/mode",
    label: selector?.label,
    options: { widget: selector?.widget ?? "select", labels: optionLabels },
  };
  const controls = Array.isArray(elements)
    ? elements.filter(
        (element) =>
          !isRecord(element) ||
          (element.scope !== "#/properties/mode" &&
            element.scope !== "#/properties/mod"),
      )
    : [];

  return {
    uischema: {
      type: "VerticalLayout",
      elements: [modeControl, ...controls] as UISchemaElement[],
    },
  };
}

function getModes(value: unknown): ModeConfig[] {
  if (!isRecord(value)) return [];

  return Object.entries(value).flatMap(([modeName, candidate]) => {
    if (!isRecord(candidate) || !isJsonConfigSchema(candidate.config_schema)) {
      return [];
    }
    return [
      {
        config_schema: candidate.config_schema,
        provider_uuid:
          typeof candidate.provider_uuid === "string"
            ? candidate.provider_uuid
            : undefined,
        value: typeof candidate.value === "string" ? candidate.value : modeName,
      },
    ];
  });
}

function getModeSelector(value: unknown): Selector | undefined {
  if (!Array.isArray(value)) return undefined;
  return value.find(
    (candidate): candidate is Selector =>
      isRecord(candidate) && Array.isArray(candidate.options),
  );
}

function orderModes(modes: ModeConfig[], selector?: Selector): ModeConfig[] {
  const order = new Map(
    (selector?.options ?? []).map(({ order: optionOrder, value }, index) => [
      value,
      optionOrder ?? index,
    ]),
  );
  return [...modes].sort(
    (left, right) =>
      (order.get(left.value) ?? Number.MAX_SAFE_INTEGER) -
      (order.get(right.value) ?? Number.MAX_SAFE_INTEGER),
  );
}

function emptyModelDynamicConfig(): ModelDynamicConfig {
  return { configDefaults: undefined, configMeta: null, configSchema: null };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
