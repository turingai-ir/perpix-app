import { useEffect, useRef } from "react";

import type { DynamicConfigForm } from "../../dynamic-config";
import type { FailedGenerationRequest } from "../model/conversation";
import { withInferredMode } from "../model/retry-config";
import type { useModel } from "./model";

/**
 * After a failed generation, puts the failed request's inputs (prompt,
 * references, settings, model) back into the composer once. They become the
 * form's baseline, so they stay and are sent again until the user edits them.
 */
export function useRestoreFailedRequest({
  dynamicForm,
  model,
  request,
}: {
  dynamicForm: DynamicConfigForm;
  model: ReturnType<typeof useModel>;
  request?: FailedGenerationRequest;
}) {
  const restoredKeyRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!request || restoredKeyRef.current === request.key) return;
    if (!dynamicForm.isReady) return;
    // The user already changed the composer: their edits win.
    if (dynamicForm.form.formState.isDirty) {
      restoredKeyRef.current = request.key;
      return;
    }
    if (request.modelUuid !== model.currentModel) {
      model.setCurrentModel(request.modelUuid);
      return;
    }
    if (model.modelState.data?.uuid !== model.currentModel) return;

    const config = withInferredMode(request.config, dynamicForm.configSchema);
    const restored = Object.fromEntries(
      Object.entries(config).filter(([field]) => dynamicForm.properties[field]),
    );
    restoredKeyRef.current = request.key;
    dynamicForm.form.reset({ ...dynamicForm.getValues(), ...restored });
  }, [dynamicForm, model, request]);
}
