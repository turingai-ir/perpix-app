import type { FC, KeyboardEvent } from "react";
import { useWatch } from "react-hook-form";

import styles from "../composer.module.css";
import { useAppTranslate } from "@/hooks";
import type { DynamicConfigForm } from "@/pages/(app)/generation/_components/dynamic-config";
import { APP_I18_KEYS } from "@/services/i18";

interface Props {
  disabled?: boolean;
  dynamicForm: DynamicConfigForm;
}

export const VideoModeTabs: FC<Props> = ({ disabled, dynamicForm }) => {
  const { t } = useAppTranslate(APP_I18_KEYS.RESOURCES.MAIN);
  const selectedMode = useWatch({
    control: dynamicForm.control,
    name: "mode",
  });
  const modeMeta = dynamicForm.getFieldMeta("mode");
  const options = modeMeta?.options?.filter(
    (option): option is string => typeof option === "string",
  );

  if (!options || options.length < 2) return null;

  const selectMode = (mode: string) =>
    dynamicForm.setValue("mode", mode, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    const keyOffset = {
      ArrowDown: 1,
      ArrowLeft: 1,
      ArrowRight: -1,
      ArrowUp: -1,
    }[event.key];
    let nextIndex = keyOffset === undefined ? index : index + keyOffset;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = options.length - 1;
    if (nextIndex === index && keyOffset === undefined) return;

    event.preventDefault();
    nextIndex = (nextIndex + options.length) % options.length;
    const nextOption = options[nextIndex];
    if (!nextOption) return;
    selectMode(nextOption);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [nextIndex]?.focus();
  };

  return (
    <section className={styles.modeField}>
      <span className={styles.modeLabel}>
        {t("pages.generation.video.studio.creationMode")}
      </span>
      <div
        aria-label={t("pages.generation.video.studio.creationMode")}
        className={styles.modeTabs}
        role="radiogroup"
      >
        {options.map((option, index) => (
          <button
            aria-checked={selectedMode === option}
            className={styles.modeTab}
            disabled={disabled}
            key={option}
            onClick={() => selectMode(option)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            role="radio"
            tabIndex={
              selectedMode === option || (selectedMode == null && index === 0)
                ? 0
                : -1
            }
            type="button"
          >
            {t(`common.dynamicConfig.optionLabels.mode.${option}`, {
              defaultValue: modeMeta?.optionLabels?.[option] ?? option,
            })}
          </button>
        ))}
      </div>
    </section>
  );
};
