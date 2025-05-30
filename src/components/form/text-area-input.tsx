import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import type { ReactNode } from 'react';
import { Flex, Text, Textarea, type TextareaProps } from '@mantine/core';

import { useAppTranslate } from '@/hook';

interface TextAreaInput<TControl extends FieldValues, TName extends FieldPath<TControl>> {
  label: ReactNode;
  showLabel?: boolean;
  control: Control<TControl>;
  errors: FieldErrors<TControl>;
  name: TName;
  rules?: {
    required?: boolean;
    maxLength?: number;
    minLength?: number;
  };
  textAreaProps?: Omit<TextareaProps, 'onChange' | 'onBlur' | 'value' | 'name' | 'ref' | 'error'>;
}

export const TextAreaInput = <TControl extends FieldValues, TName extends FieldPath<TControl>>({
  label,
  showLabel = true,
  control,
  errors,
  name,
  textAreaProps,
  rules,
}: TextAreaInput<TControl, TName>) => {
  const { t } = useAppTranslate();

  return (
    <Flex direction="column" gap="xs">
      {showLabel ? <Text>{label}</Text> : null}

      <Controller
        name={name}
        control={control}
        rules={{
          required: {
            value: rules?.required ?? false,
            message: t('components.form.rules.required', {
              name: label,
            }),
          },
          maxLength: {
            value: rules?.maxLength ?? Number.MAX_SAFE_INTEGER,
            message: t('components.form.rules.maxLength', {
              name: label,
              max: rules?.maxLength ?? Number.MAX_SAFE_INTEGER,
            }),
          },
          minLength: {
            value: rules?.minLength ?? 0,
            message: t('components.form.rules.minLength', {
              name: label,
              min: rules?.minLength ?? 0,
            }),
          },
        }}
        render={({ field }) => <Textarea error={!!errors[name]} {...field} {...textAreaProps} />}
      />
      {errors[name] ? (
        <Text c="red" size="xs" mt={4}>
          {(errors?.[name] as any)?.message ?? (errors?.[name] as any)?.message ?? ''}
        </Text>
      ) : null}
    </Flex>
  );
};
