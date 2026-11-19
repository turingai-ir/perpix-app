import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppTranslate } from "@/shared/hooks";
import { writeClips, type Clip } from "../../projects/model/clips";
import { projectsKey } from "../../projects/hooks/use-projects";
import { projectErrorKey } from "../../projects/model/project-error";
import { editProject, getProject } from "../../projects/services/projects";

const SAVE_DELAY_MS = 800;

export type SaveState = "saved" | "pending" | "saving" | "failed";

/**
 * Saves the clips shortly after the last edit. Edits made while a save is in
 * flight are saved right after it, so the server always ends with the latest
 * and never an older one. `flush` saves at once, for when the user leaves, and says whether
 * everything is saved.
 */
export function useAutosave(projectUuid: string, clips: Clip[] | undefined) {
  const client = useQueryClient();
  const { t } = useAppTranslate();
  const [state, setState] = useState<SaveState>("saved");
  const latest = useRef(clips);
  const savedSerial = useRef<string | null>(null);
  const running = useRef<Promise<boolean> | null>(null);

  const save = useCallback((): Promise<boolean> => {
    if (running.current) return running.current;
    const run = async () => {
      while (
        latest.current &&
        JSON.stringify(latest.current) !== savedSerial.current
      ) {
        const sending = latest.current;
        setState("saving");
        try {
          const current = await getProject(projectUuid);
          await editProject(projectUuid, {
            document: writeClips(current.document, sending),
          });
          savedSerial.current = JSON.stringify(sending);
        } catch (error) {
          setState("failed");
          const key = projectErrorKey(error);
          if (key) toast.error(t(key));
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
  }, [client, projectUuid, t]);

  useEffect(() => {
    latest.current = clips;
    if (clips === undefined) return;
    // The first clips seen are what is already saved.
    if (savedSerial.current === null) {
      savedSerial.current = JSON.stringify(clips);
      return;
    }
    if (JSON.stringify(clips) === savedSerial.current) {
      // An undo back to what is saved leaves nothing to save.
      setState((previous) => (previous === "pending" ? "saved" : previous));
      return;
    }
    setState("pending");
    const timer = window.setTimeout(() => void save(), SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [clips, save]);

  return { state, flush: save };
}
