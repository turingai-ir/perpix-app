import { useRef, useState } from "react";
import { Check, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/shared/ui/drawer";
import { useAppTranslate } from "@/shared/hooks";
import { useIsMobile } from "@/shared/hooks/use-mobile";
import { ImageSettingsFields } from "./image-settings-fields";
import { useImageSettings } from "../hooks/use-image-settings";
import type { DynamicConfigForm } from "../model/field-types";
import { Badge } from "@/shared/ui/badge";
import { cn } from "@/shared/lib/utils";
import { SETTINGS_BORDER_CLASS } from "./image-settings-styles";

export function ImageSettingsDialog({
  dynamicForm,
  fieldNames,
  disabled,
  modelName,
}: {
  dynamicForm: DynamicConfigForm;
  fieldNames: readonly string[];
  disabled?: boolean;
  modelName?: string;
}) {
  const { t } = useAppTranslate();
  const mobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [professionalOpen, setProfessionalOpen] = useState(false);
  const [validating, setValidating] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const settings = useImageSettings(dynamicForm, fieldNames);
  const Root = mobile ? Drawer : Dialog;
  const Content = mobile ? DrawerContent : DialogContent;
  const Title = mobile ? DrawerTitle : DialogTitle;
  const Description = mobile ? DrawerDescription : DialogDescription;
  const title = t("pages.generation.image.studio.optionalSettings");
  const confirm = async () => {
    setValidating(true);
    try {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
        await new Promise<void>((resolve) => setTimeout(resolve, 0));
      }
      await dynamicForm.form.trigger(settings.visible, { shouldFocus: true });
      await new Promise<void>((resolve) => setTimeout(resolve, 0));
      const hasSettingsError = settings.visible.some(
        (fieldName) => dynamicForm.form.getFieldState(fieldName).invalid,
      );
      // The resolver also sees required prompt fields; only this panel should
      // decide whether its own confirm action can close.
      if (hasSettingsError) setProfessionalOpen(true);
      else setOpen(false);
    } finally {
      setValidating(false);
    }
  };
  if (!settings.visible.length) return null;

  return (
    <Root
      open={open}
      onOpenChange={setOpen}
      {...(mobile ? { autoFocus: true } : {})}
    >
      <Button
        ref={triggerRef}
        type="button"
        variant="outline"
        disabled={disabled}
        className="min-h-11 gap-2 rounded-xl bg-muted/35 aria-expanded:border-primary aria-expanded:bg-[color-mix(in_srgb,var(--primary)_10%,var(--card))]"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal aria-hidden="true" className="size-4" />
        {title}
        {settings.changed.length > 0 && (
          <Badge
            variant="outline"
            className="h-auto rounded-md border-primary/28 bg-[color-mix(in_srgb,var(--primary)_18%,var(--card))] px-1.5 py-0.5 text-foreground"
            aria-label={t(
              "pages.generation.image.studio.settings.changedCount",
              { count: settings.changed.length },
            )}
          >
            {settings.changed.length}
          </Badge>
        )}
      </Button>
      <Content
        className={cn(
          "flex max-h-[min(820px,calc(100dvh-48px))] w-[calc(100vw-48px)] max-w-140 flex-col gap-0 overflow-hidden rounded-3xl border-[color-mix(in_srgb,var(--foreground)_14%,var(--border))] bg-popover/94 bg-[radial-gradient(circle_at_85%_-10%,color-mix(in_srgb,var(--primary)_13%,transparent),transparent_38%)] p-0 shadow-[inset_0_1px_color-mix(in_srgb,var(--foreground)_10%,transparent),0_28px_100px_color-mix(in_oklch,var(--shadow-ink)_52%,transparent)] backdrop-blur-xl backdrop-saturate-[145%] motion-reduce:animate-none motion-reduce:transition-none",
          "data-[slot=drawer-content]:max-h-[90dvh] data-[slot=drawer-content]:w-full data-[slot=drawer-content]:max-w-none data-[slot=drawer-content]:rounded-t-3xl data-[slot=drawer-content]:rounded-b-none",
          "contrast-more:border-foreground",
        )}
        {...(!mobile ? { showCloseButton: false } : {})}
        {...(mobile
          ? {
              onCloseAutoFocus: (event: Event) => {
                event.preventDefault();
                triggerRef.current?.focus();
              },
            }
          : { finalFocus: triggerRef })}
      >
        <header
          className={cn(
            "flex-none border-b bg-linear-to-b from-foreground/4 to-transparent px-5 py-4 md:px-6 md:pt-6 md:pb-5",
            SETTINGS_BORDER_CLASS,
          )}
        >
          <div className="flex items-center gap-3">
            <span className="grid size-11 flex-none place-items-center rounded-lg border border-primary/28 bg-primary/12 text-primary shadow-[inset_0_1px_color-mix(in_srgb,var(--foreground)_10%,transparent),0_8px_24px_color-mix(in_srgb,var(--primary)_12%,transparent)] [&_svg]:size-5">
              <SlidersHorizontal aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <Title className="text-lg leading-relaxed font-semibold">
                {title}
              </Title>
              {modelName && (
                <p className="text-start text-xs leading-loose wrap-anywhere text-muted-foreground">
                  <bdi dir="ltr">{modelName}</bdi>
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              className="size-11 shrink-0 rounded-full"
              aria-label={t("pages.generation.image.studio.settings.close")}
              onClick={() => setOpen(false)}
            >
              <X aria-hidden="true" />
            </Button>
          </div>
          <Description className="mt-4 text-subhead leading-loose text-muted-foreground">
            {t("pages.generation.image.studio.settingsHelp")}
          </Description>
        </header>
        <div className="min-h-0 flex-1 [scrollbar-width:none] overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:hidden">
          <ImageSettingsFields
            dynamicForm={dynamicForm}
            settings={settings}
            disabled={disabled || validating}
            professionalOpen={professionalOpen}
            onProfessionalOpenChange={setProfessionalOpen}
          />
        </div>
        <footer className="flex-none border-t border-[color-mix(in_srgb,var(--foreground)_14%,var(--border))] bg-[color-mix(in_srgb,var(--muted)_42%,var(--popover))] px-5 pt-3 pb-[max(16px,env(safe-area-inset-bottom))] shadow-overlay contrast-more:border-foreground md:px-6 md:pt-4 md:pb-5">
          <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
            {t("pages.generation.image.studio.settings.liveHint")}
          </p>
          <div className="flex items-center justify-between gap-3 [&_button]:min-h-11 [&_button]:rounded-xl">
            <Button
              type="button"
              variant="ghost"
              disabled={disabled || validating || !settings.changed.length}
              onClick={settings.reset}
            >
              <RotateCcw aria-hidden="true" />
              {t("pages.generation.image.studio.settings.reset")}
            </Button>
            <Button
              type="button"
              disabled={disabled || validating}
              onPointerDown={(event) => event.preventDefault()}
              onClick={() => void confirm()}
            >
              <Check aria-hidden="true" />
              {t("pages.generation.image.studio.settings.confirm")}
            </Button>
          </div>
        </footer>
      </Content>
    </Root>
  );
}
