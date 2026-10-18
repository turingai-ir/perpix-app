import type { FC, ReactNode } from "react";
import {
  useFormContext,
  type ControllerRenderProps,
  type FieldValues,
} from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Muted } from "@/components/ui/typography";

interface AuthFieldProps {
  name: string;
  label: string;
  hint?: string;
  children: (field: ControllerRenderProps<FieldValues, string>) => ReactNode;
}

export const AuthField: FC<AuthFieldProps> = ({
  name,
  label,
  hint,
  children,
}) => {
  const { control } = useFormContext();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>{children(field)}</FormControl>
          {fieldState.error ? <FormMessage /> : null}
          {!fieldState.error && hint ? <Muted>{hint}</Muted> : null}
        </FormItem>
      )}
    />
  );
};
