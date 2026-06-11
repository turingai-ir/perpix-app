import { useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  buildDefaultValues,
  buildFieldMeta,
  buildObjectZodSchema,
  createValidationMessages,
  EMPTY_CONFIG_SCHEMA,
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

import { useAppTranslate } from "@/hook";
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
  buildDefaultValues,
  buildFieldMeta,
  buildObjectZodSchema,
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

  const zodSchema = useMemo(() => {
    return buildObjectZodSchema(safeConfigSchema, validationMessages);
  }, [safeConfigSchema, validationMessages]);

  const defaultValues = useMemo(() => {
    return buildDefaultValues(safeConfigSchema, configDefaults);
  }, [safeConfigSchema, configDefaults]);

  const requiredFields = useMemo(() => {
    return safeConfigSchema.required ?? [];
  }, [safeConfigSchema]);

  const properties = useMemo(() => {
    return safeConfigSchema.properties ?? {};
  }, [safeConfigSchema]);

  const fieldMetas = useMemo(() => {
    return Object.entries(properties).map(([name, prop]) =>
      buildFieldMeta({
        name,
        prop,
        requiredFields,
        defaultValues: defaultValues as Record<string, unknown>,
        configMeta,
      }),
    );
  }, [properties, requiredFields, defaultValues, configMeta]);

  const form = useForm<DynamicConfigValues>({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: "onChange",
    ...formOptions,
  });

  useEffect(() => {
    if (!autoResetOnSchemaChange) return;

    form.reset(defaultValues);
  }, [resolvedSchemaKey, autoResetOnSchemaChange, form, defaultValues]);

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
      });
    },
    [properties, requiredFields, defaultValues, configMeta],
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
    zodSchema,
    defaultValues,
    properties,
    requiredFields,
    fieldMetas,
    getFieldMeta,
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
