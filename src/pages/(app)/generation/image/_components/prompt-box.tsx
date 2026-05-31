import { useCallback, useRef, type FC } from "react";
import { ArrowUp } from "lucide-react";

import { useModel } from "../_hooks";

import { Card } from "@/components/ui/card";
import {
  isJsonConfigSchema,
  useDynamicConfigForm,
} from "@/hooks/use-dynamic-config-form";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useAppTranslate } from "@/hook";
import { Button } from "@/components/ui/button";

export const GenerationImagePromptBox: FC = () => {
  const { modelState, modelsListState } = useModel();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useAppTranslate();

  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults: modelState.data?.config_defaults,
    configSchema: isJsonConfigSchema(modelState.data?.config_schema)
      ? modelState.data.config_schema
      : null,
    schemaKey: modelState.data?.uuid,
  });

  const submitForm = () => {};

  console.log(modelsListState.data, dynamicForm.defaultValues);

  const handleInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) {
      return;
    }
    el.style.height = "auto";
    const maxHeight = parseInt(getComputedStyle(el).lineHeight, 10) * 4;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, []);

  return (
    <div className="w-full min-w-0 px-4">
      <Card className="w-full min-w-0 max-w-full px-2">
        <Form {...dynamicForm.form}>
          <form
            className="w-full min-w-0 flex flex-col"
            onSubmit={dynamicForm.handleSubmit(submitForm)}
          >
            <FormField
              control={dynamicForm.control}
              name="prompt"
              render={({ field: { ref, value, ...field } }) => (
                <FormItem className="min-w-0 ">
                  <FormControl className="min-w-0">
                    <textarea
                      value={String(value ?? "")}
                      ref={(r) => {
                        textareaRef.current = r;
                        ref(r);
                      }}
                      onInput={handleInput}
                      rows={3}
                      wrap="soft"
                      className="wrap-break-word resize-none overflow-y-auto scrollbar-thin w-full border-none outline-none"
                      placeholder={t(
                        "pages.generation.image.promptBox.promptTextArea.placeholder",
                      )}
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="w-full">
              <Button
                variant="default"
                className="p-0! w-8! h-8! flex justify-center items-center rounded-full"
              >
                <ArrowUp className="w-5! h-5!" />
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};
