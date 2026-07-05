import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

import {
  buildAjvResolver,
  buildDefaultValues,
  buildFieldMeta,
  createValidationMessages,
  EMPTY_CONFIG_SCHEMA,
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

  const enumLabels = useMemo(() => {
    return configMeta?.ui?.labels ?? safeConfigSchema["x-ui"]?.enumLabels;
  }, [configMeta, safeConfigSchema]);

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
        widget: safeConfigSchema["x-ui"]?.widgets?.[name],
        enumLabels,
        configMeta,
      }),
    );
  }, [
    orderedFieldNames,
    properties,
    requiredFields,
    defaultValues,
    safeConfigSchema,
    enumLabels,
    configMeta,
  ]);

  const form = useForm<DynamicConfigValues>({
    resolver,
    defaultValues,
    mode: "onChange",
    ...formOptions,
  });

  useEffect(() => {
    if (!autoResetOnSchemaChange) return;

    form.reset(defaultValues);
  }, [resolvedSchemaKey, autoResetOnSchemaChange, form, defaultValues]);

  const watchedValues = form.watch();

  const visibleFieldNames = useMemo(() => {
    return getVisibleConfigFields(
      safeConfigSchema,
      watchedValues as Record<string, unknown>,
      configMeta,
    );
  }, [safeConfigSchema, watchedValues, configMeta]);

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
        widget: safeConfigSchema["x-ui"]?.widgets?.[fieldName],
        enumLabels,
        configMeta,
      });
    },
    [
      properties,
      requiredFields,
      defaultValues,
      safeConfigSchema,
      enumLabels,
      configMeta,
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
        requiredFields:
          prop.required && Array.isArray(prop.required) ? prop.required : [],
        defaultValues: {
          [fieldName]: defaultValue,
        },
        enumLabels,
        configMeta,
      });
    },
    [enumLabels, configMeta],
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
