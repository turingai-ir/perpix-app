import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/shared/hooks";
import { writeClips, type Clip } from "../../projects/model/clips";
import { projectKey, projectsKey } from "../../projects/hooks/use-projects";
import type { Project } from "../../projects/model/project";
import { projectErrorKey } from "../../projects/model/project-error";
import { saveProjectEdit } from "../../projects/services/projects";
import type { CaptionStyle } from "../../styles/model/caption-style";
import {
  writeCaptionCorrections,
  type CaptionCorrections,
} from "../model/caption-corrections";

const SAVE_DELAY_MS = 800;

export type SaveState = "saved" | "pending" | "saving" | "failed" | "conflict";

interface EditorDraft {
  clips: Clip[];
  corrections: CaptionCorrections;
  style: CaptionStyle | null;
}

const isSameDraft = (a: EditorDraft, b: EditorDraft) =>
  a.clips === b.clips && a.corrections === b.corrections && a.style === b.style;

/**
 * Saves the draft shortly after the last edit. Edits made while a save is in
 * flight are saved right after it, so the server always ends with the latest
 * and never an older one. `flush` saves at once, for when the user leaves, and says whether
 * everything is saved.
 */
export function useAutosave(
  project: Project | undefined,
  draft: EditorDraft | undefined,
) {
  const client = useQueryClient();
  const { t } = useAppTranslate();
  const [state, setState] = useState<SaveState>("saved");
  const latest = useRef(draft);
  const saved = useRef<{ project: Project; draft: EditorDraft } | null>(null);
  const running = useRef<Promise<boolean> | null>(null);
  const conflicted = useRef(false);

  const save = useCallback((): Promise<boolean> => {
    if (conflicted.current) return Promise.resolve(false);
    if (running.current) return running.current;
    const run = async () => {
      let base = saved.current;
      while (
        base &&
        latest.current &&
        !isSameDraft(latest.current, base.draft)
      ) {
        const sending = latest.current;
        setState("saving");
        try {
          let document = base.project.document;
          if (base.draft.clips !== sending.clips) {
            document = writeClips(document, sending.clips);
          }
          if (base.draft.corrections !== sending.corrections) {
            document = writeCaptionCorrections(document, sending.corrections);
          }
          if (base.draft.style !== sending.style) {
            document = { ...document, caption_style: sending.style };
          }
          const updated = await saveProjectEdit(base.project, { document });
          base = { project: updated, draft: sending };
          saved.current = base;
          client.setQueryData<Project>(projectKey(updated.uuid), (cached) =>
            cached && cached.revision > updated.revision ? cached : updated,
          );
        } catch (error) {
          const key = projectErrorKey(error);
          conflicted.current =
            key === "features.studio.projects.errors.conflict";
          setState(conflicted.current ? "conflict" : "failed");
          if (conflicted.current) {
            toast.error(t("features.studio.editor.save.conflictDetail"));
          } else if (key) toast.error(t(key));
          return false;
        }
      }
      setState("saved");
      void client.invalidateQueries({ queryKey: projectsKey });
      return true;
    };
    running.current = run().finally(() => {
      running.current = null;
    });
    return running.current;
  }, [client, t]);

  useEffect(() => {
    latest.current = draft;
    if (!project || !draft || conflicted.current) return;
    if (saved.current === null) {
      saved.current = { project, draft };
      return;
    }
    if (isSameDraft(draft, saved.current.draft)) {
      // An undo back to what is saved leaves nothing to save.
      setState((previous) => (previous === "pending" ? "saved" : previous));
      return;
    }
    setState("pending");
    const timer = window.setTimeout(() => void save(), SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [project, draft, save]);

  return { state, flush: save };
}
