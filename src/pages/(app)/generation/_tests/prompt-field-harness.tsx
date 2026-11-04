import { useRef, useState } from "react";
import { createRoot } from "react-dom/client";

import { Form } from "@/components/ui/form";
import {
  type JsonConfigSchema,
  useDynamicConfigForm,
} from "@/hooks/use-dynamic-config-form";
import { ExpandedPromptEditor } from "../_components/prompt-box/expanded-prompt-editor";
import { PromptTextarea } from "../_components/prompt-box/prompt-textarea";

const configSchema: JsonConfigSchema = {
  type: "object",
  properties: { prompt: { type: "string", default: "" } },
};
let root: ReturnType<typeof createRoot> | undefined;

function PromptFieldHarness() {
  const dynamicForm = useDynamicConfigForm({ configSchema });
  const { form } = dynamicForm;

  return (
    <Form {...form}>
      <PromptTextarea
        compact
        dynamicForm={dynamicForm}
        label="Prompt"
        placeholder="Describe an image"
      />
      <output aria-label="Prompt touched">
        {String(Boolean(form.formState.touchedFields.prompt))}
      </output>
      <button type="button" onClick={() => form.setFocus("prompt")}>
        Focus prompt
      </button>
      <button
        type="button"
        onClick={() =>
          form.setError("prompt", {
            type: "manual",
            message: "Prompt is required",
          })
        }
      >
        Show prompt error
      </button>
      <button type="button" onClick={() => form.clearErrors("prompt")}>
        Clear prompt error
      </button>
    </Form>
  );
}

function NativePromptHarness() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");

  return (
    <>
      <ExpandedPromptEditor
        ref={ref}
        value={value}
        onChange={setValue}
        textareaLabel="Native prompt"
        placeholder="Describe an image"
        id="native-prompt"
        name="native_prompt"
        maxLength={12}
        autoComplete="off"
        spellCheck={false}
        rows={3}
        className="native-prompt"
      />
      <button type="button" onClick={() => ref.current?.focus()}>
        Focus native prompt
      </button>
    </>
  );
}

export function mount(native = false) {
  root?.unmount();
  const host = document.createElement("div");
  document.body.replaceChildren(host);
  root = createRoot(host);
  root.render(native ? <NativePromptHarness /> : <PromptFieldHarness />);
}
