import { useState, type FC } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/shared/ui/button";
import { useAppTranslate } from "@/shared/hooks";
import { BottomSheet } from "../../ui/bottom-sheet";
import type { ProjectSummary } from "../model/project";

interface ProjectActionsSheetProps {
  project: ProjectSummary | null;
  onClose: () => void;
  onRename: (project: ProjectSummary) => void;
  onDelete: (project: ProjectSummary) => void;
  deleting: boolean;
}

type ActionsProps = Omit<ProjectActionsSheetProps, "onClose" | "project"> & {
  project: ProjectSummary;
};

const Actions: FC<ActionsProps> = ({
  project,
  onRename,
  onDelete,
  deleting,
}) => {
  const { t } = useAppTranslate();
  const [confirming, setConfirming] = useState(false);

  if (confirming) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-muted-foreground text-sm">
          {t("features.studio.projects.actions.deleteWarning")}
        </p>
        <Button
          variant="destructive"
          size="lg"
          className="min-h-12 gap-2"
          disabled={deleting}
          onClick={() => onDelete(project)}
        >
          {deleting && <Loader2 className="size-4 animate-spin" />}
          {t("features.studio.projects.actions.deleteConfirm")}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="min-h-12"
          disabled={deleting}
          onClick={() => setConfirming(false)}
        >
          {t("common.cancel")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Button
        variant="ghost"
        className="min-h-12 justify-start gap-3 text-base"
        onClick={() => onRename(project)}
      >
        <Pencil className="size-5" aria-hidden />
        {t("features.studio.projects.actions.rename")}
      </Button>
      <Button
        variant="ghost"
        className="text-destructive hover:text-destructive min-h-12 justify-start gap-3 text-base"
        onClick={() => setConfirming(true)}
      >
        <Trash2 className="size-5" aria-hidden />
        {t("features.studio.projects.actions.delete")}
      </Button>
    </div>
  );
};

/** What a project's menu button opens: rename, or delete after one more tap. */
export const ProjectActionsSheet: FC<ProjectActionsSheetProps> = ({
  project,
  onClose,
  ...rest
}) => (
  <BottomSheet
    open={project !== null}
    onOpenChange={(open) => !open && onClose()}
    title={project?.title ?? ""}
  >
    {project && <Actions key={project.uuid} project={project} {...rest} />}
  </BottomSheet>
);
