import { useEffect } from "react";
import { ChevronDown, SlidersHorizontal, Sparkles } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { useAppTranslate } from "@/shared/hooks";
import { DynamicPromptConfigField } from "./dynamic-config-field";
import { SettingHelpPopover } from "./setting-help-popover";
import type { DynamicConfigForm } from "../model/field-types";
import type { useImageSettings } from "../hooks/use-image-settings";
import { Badge } from "@/shared/ui/badge";
import {
  SETTINGS_CARD_CLASS,
  SETTINGS_FIELD_CLASS,
} from "./image-settings-styles";

export function ImageSettingsFields({
  dynamicForm,
  settings,
  disabled,
  professionalOpen,
  onProfessionalOpenChange,
}: {
  dynamicForm: DynamicConfigForm;
  settings: ReturnType<typeof useImageSettings>;
  disabled?: boolean;
  professionalOpen: boolean;
  onProfessionalOpenChange: (open: boolean) => void;
}) {
  const { t } = useAppTranslate();
  const firstProfessionalError = settings.professional.find(
    (name) => settings.errors[name],
  );
  useEffect(() => {
    if (firstProfessionalError) {
      dynamicForm.form.setFocus(firstProfessionalError);
    }
  }, [firstProfessionalError, dynamicForm.form]);
  const renderFields = (names: readonly string[], professional = false) =>
    names.map((name) => {
      const meta = dynamicForm.getFieldMeta(name);
      const changed = settings.changed.includes(name);
      const label = t(`pages.generation.image.studio.fields.${name}`, {
        defaultValue: meta?.title ?? name,
      });
      const hint = t(`pages.generation.image.studio.hints.${name}`, {
        defaultValue: meta?.hint ?? "",
      });
      return (
        <div
          key={name}
          className={SETTINGS_FIELD_CLASS}
          data-changed={changed || undefined}
          data-invalid={Boolean(settings.errors[name]) || undefined}
        >
          {(changed || (professional && hint)) && (
            <div className="mb-2 flex min-h-9 items-center justify-end gap-2">
              {changed && (
                <Badge
                  variant="outline"
                  className="border-primary/28 text-foreground h-auto rounded-md bg-[color-mix(in_srgb,var(--primary)_18%,var(--card))] px-1.5 py-0.5"
                >
                  {t("pages.generation.image.studio.settings.changed")}
                </Badge>
              )}
              {professional && hint && (
                <SettingHelpPopover label={label} hint={hint} />
              )}
            </div>
          )}
          <DynamicPromptConfigField
            dynamicForm={dynamicForm}
            fieldName={name}
            disabled={disabled}
            layout="stacked"
            simple
            compact={professional}
          />
        </div>
      );
    });

  return (
    <div className="flex flex-col gap-3.5 p-4 md:gap-4.5 md:p-6">
      {settings.basic.length > 0 && (
        <section
          className={SETTINGS_CARD_CLASS}
          aria-label={t("pages.generation.image.studio.settings.basic")}
        >
          <h3 className="mb-4 flex items-center gap-2 text-[13px] font-semibold text-[color-mix(in_srgb,var(--foreground)_92%,var(--primary))]">
            <Sparkles aria-hidden="true" className="text-primary size-4" />
            {t("pages.generation.image.studio.settings.basic")}
          </h3>
          <div className="flex flex-col gap-3">
            {renderFields(settings.basic)}
          </div>
        </section>
      )}
      {settings.professional.length > 0 && (
        <Collapsible
          open={professionalOpen || Boolean(firstProfessionalError)}
          onOpenChange={onProfessionalOpenChange}
          className={SETTINGS_CARD_CLASS}
        >
          <CollapsibleTrigger className="group/disclosure bg-background/70 hover-capable:hover:border-[color-mix(in_srgb,var(--foreground)_22%,var(--border))] focus-visible:outline-ring contrast-more:border-foreground flex min-h-12 w-full cursor-pointer items-center gap-2.5 rounded-xl border border-[color-mix(in_srgb,var(--foreground)_12%,var(--border))] px-2.5 py-2 text-start font-semibold transition-[border-color,background-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 data-panel-open:border-[color-mix(in_srgb,var(--primary)_40%,var(--border))] data-panel-open:bg-[color-mix(in_srgb,var(--primary)_9%,var(--background))] motion-reduce:transition-none">
            <SlidersHorizontal
              aria-hidden="true"
              className="size-4 flex-none"
            />
            <span>
              {t("pages.generation.image.studio.settings.professional")}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="ms-auto size-4 flex-none transition-transform duration-200 group-data-panel-open/disclosure:rotate-180 motion-reduce:transition-none"
            />
          </CollapsibleTrigger>
          <p className="text-muted-foreground mx-2.5 mt-2.5 mb-4 text-xs leading-loose">
            {t("pages.generation.image.studio.settings.professionalHint")}
          </p>
          <CollapsibleContent>
            <div className="flex flex-col gap-3">
              {renderFields(settings.professional, true)}
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
