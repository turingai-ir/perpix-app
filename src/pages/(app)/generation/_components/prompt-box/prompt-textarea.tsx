import type { FC } from "react";
import { Sparkles } from "lucide-react";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";
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
              <FormLabel className="text-foreground flex items-center gap-2 text-sm font-semibold">
                <Sparkles aria-hidden="true" className="text-primary size-4" />
                {label}
              </FormLabel>
              {hint && (
                <FormDescription className="text-muted-foreground text-xs leading-6">
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
                className="border-border bg-muted/20 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 block min-h-28 w-full resize-y rounded-xl border px-3 py-2.5 text-base leading-7 wrap-anywhere outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
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
