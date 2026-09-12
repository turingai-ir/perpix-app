import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";
import { useAppTranslate } from "@/hooks";

type Props = {
  disabled: boolean;
  dynamicForm: DynamicConfigForm;
};

export function ImageIdeaStarters({ disabled, dynamicForm }: Props) {
  const { t } = useAppTranslate();
  const starters = t("pages.generation.image.studio.starters", {
    returnObjects: true,
  }) as string[];

  return (
    <div className="border-border/60 space-y-2 border-t pt-5">
      <p className="text-primary text-xs font-semibold tracking-wide">
        {t("pages.generation.image.studio.stepIdea")}
      </p>
      <p className="text-muted-foreground text-sm">
        {t("pages.generation.image.studio.ideaHint")}
      </p>
      <div className="flex flex-wrap gap-2">
        {starters.map((starter) => (
          <button
            key={starter}
            type="button"
            disabled={disabled}
            onClick={() =>
              dynamicForm.setValue("prompt", starter, {
                shouldDirty: true,
                shouldValidate: true,
              })
            }
            className="border-border bg-background hover:border-primary hover:text-primary focus-visible:outline-ring min-h-10 cursor-pointer rounded-full border px-3 text-xs transition-colors focus-visible:outline-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {starter}
          </button>
        ))}
      </div>
    </div>
  );
}
