import type { SchemaAiRegistryModelSummary } from "@/services/api";

export const isModelAllowed = (
  model: Pick<SchemaAiRegistryModelSummary, "name">,
  allowedModelNames: readonly string[] | null | undefined,
) => !allowedModelNames || allowedModelNames.includes(model.name);
