import { useEffect, useRef, useState, type FC, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useAppTranslate } from "@/shared/hooks";
import { BottomSheet } from "../../ui/bottom-sheet";
import { normalizeTitle, PROJECT_TITLE_MAX_LENGTH } from "../model/project";

interface ProjectTitleSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "rename";
  initialTitle: string;
  pending: boolean;
  onSubmit: (title: string) => void;
}

interface TitleFormProps {
  mode: "create" | "rename";
  initialTitle: string;
  pending: boolean;
  onSubmit: (title: string) => void;
}

// A separate component so the field starts from the right text every time the
// sheet opens, without an effect to reset it.
const TitleForm: FC<TitleFormProps> = ({
  mode,
  initialTitle,
  pending,
  onSubmit,
}) => {
  const { t } = useAppTranslate();
  const [text, setText] = useState(initialTitle);
  const title = normalizeTitle(text);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    field.current?.focus({ preventScroll: true });
    field.current?.select();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (title && !pending) onSubmit(title);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        ref={field}
        value={text}
        onChange={(event) => setText(event.target.value)}
        maxLength={PROJECT_TITLE_MAX_LENGTH}
        placeholder={t("features.studio.projects.naming.placeholder")}
        aria-label={t("features.studio.projects.naming.label")}
        enterKeyHint="done"
      />
      <Button
        type="submit"
        size="lg"
        className="min-h-12 gap-2"
        disabled={!title || pending}
      >
        {pending && <Loader2 className="size-4 animate-spin" />}
        {mode === "create"
          ? t("features.studio.projects.naming.create")
          : t("features.studio.projects.naming.save")}
      </Button>
    </form>
  );
};

/** One field in a bottom sheet: naming a new project or renaming one. */
export const ProjectTitleSheet: FC<ProjectTitleSheetProps> = ({
  open,
  onOpenChange,
  mode,
  initialTitle,
  pending,
  onSubmit,
}) => {
  const { t } = useAppTranslate();

  return (
    <BottomSheet
      open={open}
      onOpenChange={onOpenChange}
      title={
        mode === "create"
          ? t("features.studio.projects.naming.createHeading")
          : t("features.studio.projects.naming.renameHeading")
      }
    >
      {open && (
        <TitleForm
          mode={mode}
          initialTitle={initialTitle}
          pending={pending}
          onSubmit={onSubmit}
        />
      )}
    </BottomSheet>
  );
};
