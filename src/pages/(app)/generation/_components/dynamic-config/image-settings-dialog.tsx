import { useRef, useState } from "react";
import { Check, RotateCcw, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useAppTranslate } from "@/hooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageSettingsFields } from "./image-settings-fields";
import { useImageSettings } from "./use-image-settings";
import type { DynamicConfigForm } from "./types";
import styles from "./image-settings.module.css";

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
  const Trigger = mobile ? DrawerTrigger : DialogTrigger;
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
      <Trigger asChild>
        <Button
          ref={triggerRef}
          type="button"
          variant="outline"
          disabled={disabled}
          className={styles.trigger}
        >
          <SlidersHorizontal aria-hidden="true" className="size-4" />
          {title}
          {settings.changed.length > 0 && (
            <span
              className={styles.count}
              aria-label={t(
                "pages.generation.image.studio.settings.changedCount",
                { count: settings.changed.length },
              )}
            >
              {settings.changed.length}
            </span>
          )}
        </Button>
      </Trigger>
      <Content
        className={styles.panel}
        {...(!mobile ? { showCloseButton: false } : {})}
        onCloseAutoFocus={(event) => {
          event.preventDefault();
          triggerRef.current?.focus();
        }}
      >
        <header className={styles.header}>
          <div className={styles.headingRow}>
            <span className={styles.headingIcon}>
              <SlidersHorizontal aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <Title className={styles.title}>{title}</Title>
              {modelName && (
                <p className={styles.model}>
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
          <Description className={styles.description}>
            {t("pages.generation.image.studio.settingsHelp")}
          </Description>
        </header>
        <div className={styles.scroll}>
          <ImageSettingsFields
            dynamicForm={dynamicForm}
            settings={settings}
            disabled={disabled || validating}
            professionalOpen={professionalOpen}
            onProfessionalOpenChange={setProfessionalOpen}
          />
        </div>
        <footer className={styles.footer}>
          <p>{t("pages.generation.image.studio.settings.liveHint")}</p>
          <div className={styles.footerActions}>
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
