import {
  FormControl,
  FormLabel,
  Select,
  Input,
  HStack,
  FormErrorMessage,
  type InputProps,
  type SelectProps,
} from '@chakra-ui/react'
import {
  Controller,
  type Control,
  type FieldErrors,
  type FieldPath,
  type FieldValues,
} from 'react-hook-form'
import type { ReactNode } from 'react'

import { useAppTranslate } from '@/hook'

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}.${P}`
    : never
  : never

interface PhoneNumberInputProps<
  TControl extends FieldValues,
  TName extends FieldPath<TControl>, // e.g. "phone"
> {
  label: ReactNode
  control: Control<TControl>
  errors: FieldErrors<TControl>
  name: TName
  preCodeName: string
  inputName: string
  selectOptions: { value: string; label: string }[]
  inputProps?: Omit<InputProps, 'onChange' | 'onBlur' | 'value' | 'disabled' | 'name' | 'ref'>
  selectProps?: Omit<SelectProps, 'onChange' | 'onBlur' | 'value' | 'name' | 'ref'>
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
  const { t } = useAppTranslate()

  const finalPreCodeName = `${name}.${preCodeName}` as Join<TName, 'preCode'>
  const finalInputName = `${name}.${inputName}` as Join<TName, 'input'>

  return (
    <FormControl isInvalid={!!errors?.[name]}>
      <FormLabel>{label}</FormLabel>
      <HStack>
        <Controller
          name={finalInputName as unknown as FieldPath<TControl>}
          control={control}
          rules={{
            required: t('components.form.rules.required', { name: label }),
            pattern: {
              value: /^[0-9]{10}$/,
              message: t('components.form.rules.incorrectRegex', {
                name: label,
              }),
            },
          }}
          render={({ field }) => <Input type="number" dir="ltr" {...inputProps} {...field} />}
        />
        <Controller
          name={finalPreCodeName as unknown as FieldPath<TControl>}
          control={control}
          rules={{ required: t('components.form.rules.required', { name: label }) }}
          render={({ field }) => (
            <Select w="100px" {...selectProps} {...field}>
              {selectOptions.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </Select>
          )}
        />
      </HStack>
      <FormErrorMessage>
        {(errors?.[name] as any)?.input?.message ?? (errors?.[name] as any)?.preCode?.message ?? ''}
      </FormErrorMessage>
    </FormControl>
  )
}
