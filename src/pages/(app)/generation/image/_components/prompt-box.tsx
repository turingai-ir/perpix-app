import { useCallback, useRef, useState, type FC } from "react";
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
import { useFileManager } from "@/feature/file-manager/hook";
import { HorizontalImageUploader } from "@/components/custom/horizontal-image-uploader";

export const GenerationImagePromptBox: FC = () => {
  const { modelState } = useModel();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { t } = useAppTranslate();
  const { filesPreview, pendingUploads, requestUpload } =
    useFileManager("image_generation");

  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const dynamicForm = useDynamicConfigForm({
    autoResetOnSchemaChange: true,
    configDefaults: modelState.data?.config_defaults,
    configSchema: isJsonConfigSchema(modelState.data?.config_schema)
      ? modelState.data.config_schema
      : null,
    schemaKey: modelState.data?.uuid,
  });

  const submitForm = () => {};

  console.log({
    defaultValues: dynamicForm.defaultValues,
    filesPreview,
    pendingUploads,
  });

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
    <div className="w-full min-w-0 overflow-hidden px-4">
      <Card className="w-full min-w-0 overflow-hidden px-2">
        <HorizontalImageUploader
          images={[
            ...selectedImages.map((i) => ({
              id: i,
              url: filesPreview.get(i),
              status: "success" as const,
            })),
          ]}
          onDeleteClick={(imageId) => {
            setSelectedImages((pre) => pre.filter((id) => id !== imageId));
          }}
          onFileSelect={async (file) => {
            const res = await requestUpload(file);
            if (res) {
              setSelectedImages((pre) => [...pre, res]);
            }
          }}
          showPlaceholder
          label={t("common.addImage")}
          accept="image/jpeg, image/png"
        />
        <Form {...dynamicForm.form}>
          <form
            className="flex w-full min-w-0 flex-col"
            onSubmit={dynamicForm.handleSubmit(submitForm)}
          >
            <FormField
              control={dynamicForm.control}
              name="prompt"
              render={({ field: { ref, value, ...field } }) => (
                <FormItem>
                  <FormControl>
                    <textarea
                      value={String(value ?? "")}
                      ref={(r) => {
                        textareaRef.current = r;
                        ref(r);
                      }}
                      onInput={handleInput}
                      rows={3}
                      wrap="soft"
                      className="wrap-break-word w-full resize-none overflow-y-auto border-none outline-none"
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
