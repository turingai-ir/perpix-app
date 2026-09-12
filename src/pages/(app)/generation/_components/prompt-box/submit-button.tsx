import type { FC } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";

export const PromptSubmitButton: FC<{
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
  isLoading?: boolean;
  promptRequired: boolean;
  label?: string;
}> = ({ disabled, dynamicForm, isLoading, promptRequired, label }) => {
  const prompt = String(dynamicForm.watch("prompt") ?? "");
  const isPromptInvalid = promptRequired && prompt.trim().length < 3;

  return (
    <Button
      type="submit"
      variant="default"
      className={
        label
          ? "group h-11 w-full gap-2 rounded-xl px-6 md:w-auto"
          : "group flex h-8! w-8! cursor-pointer items-center justify-center rounded-full p-0!"
      }
      disabled={disabled || isPromptInvalid}
    >
      {label ? <span>{label}</span> : null}
      {isLoading ? (
        <Loader2 className="h-5! w-5! animate-spin" />
      ) : (
        <ArrowUp className="h-5! w-5! transition-transform duration-100 ease-out group-hover:rotate-90" />
      )}
    </Button>
  );
};
