import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  buildAjvResolver,
  buildDefaultValues,
  buildFieldMeta,
  createValidationMessages,
  EMPTY_CONFIG_SCHEMA,
  getConditionalProperty,
  getOrderedFieldNames,
  getVisibleConfigFields,
  sanitizeConfigValues,
  stripUndefinedDeep,
} from "./schema";
import type {
  DynamicConfigValidationMessages,
  DynamicConfigValues,
  FieldMeta,
  JsonConfigMeta,
  JsonConfigSchema,
  JsonSchemaProperty,
  JsonSchemaType,
  UseDynamicConfigFormInput,
} from "./types";
export { getPrimaryType } from "./types";

import { useAppTranslate } from "@/hooks";
import { APP_I18_KEYS } from "@/services/i18";

export type {
  DynamicConfigValidationMessages,
  DynamicConfigValues,
  FieldMeta,
  JsonConfigMeta,
  JsonConfigSchema,
  JsonSchemaProperty,
  JsonSchemaType,
  UseDynamicConfigFormInput,
};

export {
  buildAjvResolver,
  buildDefaultValues,
  buildFieldMeta,
  getOrderedFieldNames,
  getVisibleConfigFields,
  isJsonConfigSchema,
  sanitizeConfigValues,
} from "./schema";

export function useDynamicConfigForm({
  configSchema,
  configDefaults,
  configMeta,
  schemaKey,
  autoResetOnSchemaChange = true,
  formOptions,
}: UseDynamicConfigFormInput) {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const safeConfigSchema = configSchema ?? EMPTY_CONFIG_SCHEMA;

  const isReady = Boolean(configSchema?.properties);

  const resolvedSchemaKey =
    schemaKey ?? configSchema?.$id ?? "empty-dynamic-config-schema";

  const validationMessages = useMemo<DynamicConfigValidationMessages>(() => {
    return createValidationMessages(t);
  }, [t]);

  const resolver = useMemo(() => {
    return buildAjvResolver(safeConfigSchema, validationMessages, {
      cacheKey: resolvedSchemaKey,
      configMeta,
    });
  }, [safeConfigSchema, validationMessages, resolvedSchemaKey, configMeta]);

  const defaultValues = useMemo(() => {
    return buildDefaultValues(safeConfigSchema, configDefaults);
  }, [safeConfigSchema, configDefaults]);

  const requiredFields = useMemo(() => {
    return safeConfigSchema.required ?? [];
  }, [safeConfigSchema]);

  const properties = useMemo(() => {
    return safeConfigSchema.properties ?? {};
  }, [safeConfigSchema]);

  const orderedFieldNames = useMemo(() => {
    return getOrderedFieldNames(safeConfigSchema, configMeta);
  }, [safeConfigSchema, configMeta]);

  const fieldMetas = useMemo(() => {
    return orderedFieldNames.map((name) =>
      buildFieldMeta({
        name,
        prop: properties[name],
        requiredFields,
        defaultValues: defaultValues as Record<string, unknown>,
        configMeta,
        configSchema: safeConfigSchema,
        values: defaultValues as Record<string, unknown>,
      }),
    );
  }, [
    orderedFieldNames,
    properties,
    requiredFields,
    defaultValues,
    configMeta,
    safeConfigSchema,
  ]);

  const form = useForm<DynamicConfigValues>({
    resolver,
    defaultValues,
    mode: "onBlur",
    ...formOptions,
  });
  const currentValues = useWatch({ control: form.control });

  useEffect(() => {
    for (const fieldName of Object.keys(safeConfigSchema.properties)) {
      const property = getConditionalProperty(
        safeConfigSchema,
        fieldName,
        currentValues,
      );
      const options = property?.enum;
      const currentValue = currentValues[fieldName];

      const isCurrentValueAllowed = options?.some((option) =>
        Object.is(option, currentValue),
      );

      if (!options || currentValue === undefined || isCurrentValueAllowed) {
        continue;
      }

      const nextValue =
        property.default !== undefined &&
        options.some((option) => Object.is(option, property.default))
          ? property.default
          : options[0];

      if (nextValue !== undefined) {
        form.setValue(fieldName, nextValue, { shouldValidate: true });
      }
    }
  }, [currentValues, form, safeConfigSchema]);

  const prevSchemaKeyRef = useRef(resolvedSchemaKey);

  useEffect(() => {
    if (!autoResetOnSchemaChange) return;

    if (prevSchemaKeyRef.current !== resolvedSchemaKey) {
      prevSchemaKeyRef.current = resolvedSchemaKey;
      form.reset(defaultValues);
    }
  }, [resolvedSchemaKey, autoResetOnSchemaChange, form, defaultValues]);

  const visibleFieldSignature = useWatch({
    control: form.control,
    compute: (values) => {
      return [...getVisibleConfigFields(safeConfigSchema, values, configMeta)]
        .sort()
        .join("\u0000");
    },
  });
  const visibleFieldNames = useMemo(
    () =>
      new Set(
        visibleFieldSignature ? visibleFieldSignature.split("\u0000") : [],
      ),
    [visibleFieldSignature],
  );

  const isFieldVisible = useCallback(
    (fieldName: string) => {
      return visibleFieldNames.has(fieldName);
    },
    [visibleFieldNames],
  );

  const getFieldMeta = useCallback(
    (fieldName: string): FieldMeta | undefined => {
      const prop = properties[fieldName];

      if (!prop) return undefined;

      return buildFieldMeta({
        name: fieldName,
        prop,
        requiredFields,
        defaultValues: defaultValues as Record<string, unknown>,
        configMeta,
        configSchema: safeConfigSchema,
        values: currentValues,
      });
    },
    [
      properties,
      requiredFields,
      defaultValues,
      configMeta,
      safeConfigSchema,
      currentValues,
    ],
  );

  const getFieldMetaForProperty = useCallback(
    (
      fieldName: string,
      prop: JsonSchemaProperty,
      defaultValue?: unknown,
    ): FieldMeta => {
      return buildFieldMeta({
        name: fieldName,
        prop,
        requiredFields: prop.required ?? [],
        defaultValues: {
          [fieldName]: defaultValue,
        },
        configMeta,
        values: currentValues,
      });
    },
    [configMeta, currentValues],
  );

  const getCleanValues = useCallback(() => {
    return sanitizeConfigValues(
      safeConfigSchema,
      stripUndefinedDeep(form.getValues()),
    );
  }, [form, safeConfigSchema]);

  const handleSubmit: typeof form.handleSubmit = useCallback(
    (onValid, onInvalid) => {
      return form.handleSubmit((values, event) => {
        const cleaned = sanitizeConfigValues(
          safeConfigSchema,
          stripUndefinedDeep(values),
        );
        return onValid(cleaned, event);
      }, onInvalid);
    },
    [form, safeConfigSchema],
  );

  const handleCleanSubmit = useCallback(
    (
      onValid: (values: DynamicConfigValues) => void | Promise<void>,
      onInvalid?: Parameters<typeof form.handleSubmit>[1],
    ) => {
      return handleSubmit((values) => onValid(values), onInvalid);
    },
    [form, handleSubmit],
  );

  return {
    isReady,
    form,
    configSchema: safeConfigSchema,
    defaultValues,
    properties,
    requiredFields,
    orderedFieldNames,
    fieldMetas,
    visibleFieldNames,
    isFieldVisible,
    getFieldMeta,
    getFieldMetaForProperty,
    register: form.register,
    control: form.control,
    handleSubmit,
    handleCleanSubmit,
    formState: form.formState,
    setValue: form.setValue,
    getValues: form.getValues,
    getCleanValues,
    watch: form.watch,
    reset: form.reset,
    trigger: form.trigger,
    clearErrors: form.clearErrors,
  };
}
