import type { SchemaAiRegistryModelSummary } from "@/services/api";

export const isModelAllowed = (
  model: Pick<SchemaAiRegistryModelSummary, "name">,
  allowedModelNames: readonly string[] | null | undefined,
) => !allowedModelNames || allowedModelNames.includes(model.name);

export const getDefaultAccessibleModel = <
  TModel extends Pick<SchemaAiRegistryModelSummary, "name" | "uuid">,
>(
  models: readonly TModel[] | undefined,
  allowedModelNames: readonly string[] | null | undefined,
) =>
  models?.find((model) => isModelAllowed(model, allowedModelNames)) ??
  models?.[0];
