import {
  Clapperboard,
  Film,
  Image,
  Images,
  MoveUpRight,
  Scissors,
  Type,
} from "lucide-react";
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

const GROUPS = ["create", "edit", "motion"] as const;
type ModeGroup = (typeof GROUPS)[number];

function groupForMode(mode: string): ModeGroup {
  if (mode === "motion_control") return "motion";
  if (["video_edit", "video_extend", "video_to_video"].includes(mode))
    return "edit";
  return "create";
}

const GROUP_ICONS = {
  create: Clapperboard,
  edit: Scissors,
  motion: MoveUpRight,
};
const INPUT_ICONS: Record<string, typeof Film> = {
  text_to_video: Type,
  image_to_video: Image,
  reference_to_video: Images,
};

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

  const availableGroups = GROUPS.filter((group) =>
    options.some((option) => groupForMode(option) === group),
  );
  const activeGroup =
    typeof selectedMode === "string" && options.includes(selectedMode)
      ? groupForMode(selectedMode)
      : availableGroups[0];
  const groupOptions = options.filter(
    (option) => groupForMode(option) === activeGroup,
  );
  const selectMode = (mode: string) =>
    dynamicForm.setValue("mode", mode, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  const selectGroup = (group: ModeGroup) => {
    const first = options.find((option) => groupForMode(option) === group);
    if (first) selectMode(first);
  };
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
    if (event.key === "End") nextIndex = groupOptions.length - 1;
    if (nextIndex === index && keyOffset === undefined) return;

    event.preventDefault();
    nextIndex = (nextIndex + groupOptions.length) % groupOptions.length;
    const nextOption = groupOptions[nextIndex];
    if (!nextOption) return;
    selectMode(nextOption);
    event.currentTarget.parentElement
      ?.querySelectorAll<HTMLButtonElement>('[role="radio"]')
      [nextIndex]?.focus();
  };

  return (
    <section className={styles.modeField}>
      {availableGroups.length > 1 && (
        <span className={styles.modeLabel}>
          {t("pages.generation.video.studio.creationMode")}
        </span>
      )}
      {availableGroups.length > 1 && (
        <div
          aria-label={t("pages.generation.video.studio.creationMode")}
          className={styles.modeTabs}
          style={{
            gridTemplateColumns: `repeat(${availableGroups.length}, minmax(0, 1fr))`,
          }}
          role="group"
        >
          {availableGroups.map((group) => {
            const Icon = GROUP_ICONS[group];
            return (
              <button
                aria-pressed={activeGroup === group}
                className={styles.modeTab}
                disabled={disabled}
                key={group}
                onClick={() => selectGroup(group)}
                type="button"
              >
                <Icon aria-hidden="true" size={17} strokeWidth={1.8} />
                {t(`pages.generation.video.studio.modeGroups.${group}`)}
              </button>
            );
          })}
        </div>
      )}
      {groupOptions.length > 1 && (
        <div className={styles.modeChoices}>
          <span className={styles.modeChoiceLabel}>
            {t("pages.generation.video.studio.inputMethod")}
          </span>
          <div
            className={styles.modeOptions}
            style={{
              gridTemplateColumns: `repeat(${Math.min(groupOptions.length, 3)}, minmax(0, 1fr))`,
            }}
            role="radiogroup"
            aria-label={t("pages.generation.video.studio.inputMethod")}
          >
            {groupOptions.map((option, index) => {
              const Icon = INPUT_ICONS[option] ?? Film;
              return (
                <button
                  aria-checked={selectedMode === option}
                  className={styles.modeOption}
                  disabled={disabled}
                  key={option}
                  onClick={() => selectMode(option)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  role="radio"
                  tabIndex={
                    selectedMode === option ||
                    (selectedMode == null && index === 0)
                      ? 0
                      : -1
                  }
                  type="button"
                >
                  <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
                  {t(`common.dynamicConfig.optionLabels.mode.${option}`, {
                    defaultValue: modeMeta?.optionLabels?.[option] ?? option,
                  })}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
};
