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

import { useAppTranslate } from "@/shared/hooks";
import type { DynamicConfigForm } from "@/features/dynamic-config";
import { APP_I18_KEYS } from "@/shared/i18n";

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
    <section className="col-span-full grid gap-3">
      {availableGroups.length > 1 && (
        <span className="text-muted-foreground text-xs font-semibold">
          {t("pages.generation.video.studio.creationMode")}
        </span>
      )}
      {availableGroups.length > 1 && (
        <div
          aria-label={t("pages.generation.video.studio.creationMode")}
          className="border-border bg-background grid gap-1 rounded-xl border p-1"
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
                className="text-muted-foreground ease-out-quint aria-pressed:bg-accent aria-pressed:text-accent-foreground hover-capable:hover:not-aria-pressed:not-disabled:bg-accent/50 flex min-h-11 min-w-0 items-center justify-center gap-1.5 rounded-lg border-0 bg-transparent p-2 text-xs leading-normal font-semibold transition-[color,background-color,box-shadow,transform] duration-150 not-disabled:active:scale-[0.97] disabled:cursor-wait disabled:opacity-50 aria-pressed:shadow-[inset_0_0_0_1px_color-mix(in_srgb,var(--primary)_55%,transparent)] motion-reduce:transition-none [&_svg]:size-4 [&_svg]:flex-none"
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
        <div className="text-muted-foreground grid min-h-0 gap-2">
          <span className="text-xs">
            {t("pages.generation.video.studio.inputMethod")}
          </span>
          <div
            className="grid gap-1.5"
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
                  className="border-border bg-muted/50 text-muted-foreground hover-capable:hover:not-aria-checked:not-disabled:bg-accent/50 aria-checked:border-primary/70 aria-checked:bg-accent aria-checked:text-accent-foreground [&_svg]:text-muted-foreground aria-checked:[&_svg]:text-primary flex min-h-18 min-w-0 flex-col items-center justify-center gap-1.5 rounded-[10px] border px-1 py-2.5 text-xs leading-normal font-semibold transition-[color,background-color,border-color] duration-150 disabled:cursor-wait disabled:opacity-50 motion-reduce:transition-none"
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
