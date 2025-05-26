import {
  Box,
  Flex,
  NativeSelect,
  type NativeSelectProps,
  NumberInput,
  type NumberInputProps,
  Text,
} from '@mantine/core';
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form';
import type { ReactNode } from 'react';

import { useAppTranslate } from '@/hook';
import { persianNumbersToEnglish } from '@/utils';

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never;

interface PhoneNumberInputProps<
  TControl extends FieldValues,
  TName extends FieldPath<TControl>, // e.g. "phone"
> {
  label: ReactNode;
  control: Control<TControl>;
  errors: FieldErrors<TControl>;
  name: TName;
  preCodeName: string;
  inputName: string;
  selectOptions: { value: string; label: string }[];
  inputProps?: Omit<
    NumberInputProps,
    'onChange' | 'onBlur' | 'value' | 'disabled' | 'name' | 'ref'
  >;
  selectProps?: Omit<NativeSelectProps, 'onChange' | 'onBlur' | 'value' | 'name' | 'ref'>;
}

export const PhoneNumberInput = <TControl extends FieldValues, TName extends FieldPath<TControl>>({
  label,
  control,
  errors,
  name,
  inputName,
  preCodeName,
  inputProps,
  selectProps,
  selectOptions,
}: PhoneNumberInputProps<TControl, TName>) => {
  const { t } = useAppTranslate();

  const finalPreCodeName = `${name}.${preCodeName}` as Join<TName, 'preCode'>;
  const finalInputName = `${name}.${inputName}` as Join<TName, 'input'>;

  return (
    <Flex direction={'column'} gap="xs">
      <Text>{label}</Text>
      <Controller
        name={finalInputName as unknown as FieldPath<TControl>}
        control={control}
        rules={{
          validate: (value) => {
            if (!value) {
              return t('components.form.rules.required', { name: label });
            }
            if (!/^\d{10}$/.test(value)) {
              return t('components.form.rules.phoneNumber', { name: label });
            }
            return true;
          },
        }}
        render={({ field }) => (
          <NumberInput
            rightSection={
              <Controller
                name={finalPreCodeName as unknown as FieldPath<TControl>}
                control={control}
                rules={{ required: t('components.form.rules.required', { name: label }) }}
                render={({ field }) => (
                  <NativeSelect
                    rightSectionWidth={28}
                    styles={{
                      input: {
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        width: 62,
                        marginRight: -2,
                      },
                    }}
                    className="tw-w-16"
                    {...selectProps}
                    {...field}
                  >
                    {selectOptions.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
                  </NativeSelect>
                )}
              />
            }
            className="tw-w-[calc(100%-20px)] tw-text-blue tw-bl"
            error={!!errors?.[name]}
            classNames={{ input: 'no-spinner tw-ltr !tw-text-left ' }}
            styles={{
              input: {
                paddingLeft: '3rem',
              },
            }}
            inputMode="numeric"
            dir="ltr"
            {...inputProps}
            {...field}
            onChange={(value) => {
              if (!value) {
                field.onChange('');
                return;
              }

              const sanitizedInput = persianNumbersToEnglish(value.toString()).replace(/^0+/, '');
              const sanitizedValue = parseInt(sanitizedInput || '0', 10);
              field.onChange(sanitizedValue);
            }}
          />
        )}
      />
      {!!errors?.[name] ? (
        <Text c="red" size="xs" mt={4}>
          {(errors?.[name] as any)?.input?.message ??
            (errors?.[name] as any)?.preCode?.message ??
            ''}
        </Text>
      ) : null}
    </Flex>
  );
};
