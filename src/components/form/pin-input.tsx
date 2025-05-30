import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import type { ReactNode } from 'react';
import { Flex, PinInput as MatinePinInput, Text } from '@mantine/core';

import { useAppTranslate } from '@/hook';

interface PinInputProps<TControl extends FieldValues, TName extends FieldPath<TControl>> {
  label: ReactNode;
  control: Control<TControl>;
  errors: FieldErrors<TControl>;
  name: TName;
  length: number;
}

export const PinInput = <TControl extends FieldValues, TName extends FieldPath<TControl>>({
  label,
  control,
  errors,
  name,
  length,
}: PinInputProps<TControl, TName>) => {
  const { t } = useAppTranslate();

  return (
    <Flex direction="column" gap="xs">
      <Text>{label}</Text>
      <Controller
        name={name}
        control={control}
        rules={{
          validate: (value) => {
            if (!value) {
              return t('components.form.rules.required', { name: label });
            }

            return true;
          },
        }}
        render={({ field }) => (
          <MatinePinInput
            error={!!errors[name]}
            type={/^[0-9]*$/}
            inputType="tel"
            inputMode="numeric"
            {...field}
            length={length}
          />
        )}
      />
      {errors[name] ? (
        <Text c="red" size="xs" mt={4}>
          {(errors?.[name] as any)?.message ?? (errors?.[name] as any)?.message ?? ''}
        </Text>
      ) : null}
    </Flex>
  );
};
