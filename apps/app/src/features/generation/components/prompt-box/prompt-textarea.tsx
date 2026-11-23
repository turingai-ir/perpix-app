import type { FC } from "react";
import { Sparkles } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { ScrollArea } from "@/shared/ui/scroll-area";
import type { DynamicConfigForm } from "@/features/dynamic-config";
import { ExpandedPromptEditor } from "./expanded-prompt-editor";

export const PromptTextarea: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  placeholder: string;
  label?: string;
  hint?: string;
  compact?: boolean;
}> = ({ disabled, dynamicForm, placeholder, label, hint, compact }) => (
  <FormField
    control={dynamicForm.control}
    name="prompt"
    render={({ field }) => (
      <FormItem
        className={
          compact ? "min-w-0 flex-1" : label ? "min-w-0 space-y-3" : undefined
        }
      >
        {compact ? (
          <>
            {label && <FormLabel className="sr-only">{label}</FormLabel>}
            <FormControl>
              <ExpandedPromptEditor
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                value={String(field.value ?? "")}
                onChange={field.onChange}
                disabled={disabled}
                placeholder={placeholder}
                textareaLabel={label ?? placeholder}
              />
            </FormControl>
            <FormMessage />
          </>
        ) : label ? (
          <>
            <div className="space-y-1">
              <FormLabel className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles aria-hidden="true" className="size-4 text-primary" />
                {label}
              </FormLabel>
              {hint && (
                <FormDescription className="text-xs leading-6 text-muted-foreground">
                  {hint}
                </FormDescription>
              )}
            </div>
            <FormControl>
              <textarea
                {...field}
                value={String(field.value ?? "")}
                rows={4}
                wrap="soft"
                disabled={disabled}
                className="block min-h-28 w-full resize-y rounded-xl border border-border bg-muted/20 px-3 py-2.5 text-base leading-7 wrap-anywhere outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
              />
            </FormControl>
            <FormMessage />
          </>
        ) : (
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
            <FormMessage />
          </ScrollArea>
        )}
      </FormItem>
    )}
  />
);
