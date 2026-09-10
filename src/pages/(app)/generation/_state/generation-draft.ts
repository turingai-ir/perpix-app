export interface GenerationDraftState {
  generationDraft: { prompt: string };
}

export function createGenerationDraftState(
  prompt: string,
): GenerationDraftState {
  return { generationDraft: { prompt } };
}

export function getGenerationDraftPrompt(state: unknown) {
  if (!state || typeof state !== "object" || !("generationDraft" in state)) {
    return undefined;
  }
  const draft = state.generationDraft;
  if (!draft || typeof draft !== "object" || !("prompt" in draft)) {
    return undefined;
  }
  return typeof draft.prompt === "string" ? draft.prompt : undefined;
}
