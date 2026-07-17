import type { FC } from "react";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";

export const PromptTextarea: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  placeholder: string;
}> = ({ disabled, dynamicForm, placeholder }) => (
  <FormField
    control={dynamicForm.control}
    name="prompt"
    render={({ field }) => (
      <FormItem>
        <ScrollArea
          className="h-30 w-full overflow-hidden"
          viewportClassName="h-30"
        >
          <FormControl>
            <textarea
              name={field.name}
              value={String(field.value ?? "")}
              ref={field.ref}
              onBlur={field.onBlur}
              onChange={field.onChange}
              rows={5}
              wrap="soft"
              disabled={disabled}
              className="block h-30 w-full resize-none overflow-y-auto border-none wrap-anywhere break-all outline-none"
              placeholder={placeholder}
            />
          </FormControl>
        </ScrollArea>
      </FormItem>
    )}
  />
);
