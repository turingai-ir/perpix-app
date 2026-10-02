import { z } from "zod";

const documentSchema = z
  .object({
    paths: z.record(z.string(), z.json()),
    components: z
      .object({ schemas: z.record(z.string(), z.json()) })
      .passthrough(),
  })
  .passthrough();

type JsonValue = z.infer<ReturnType<typeof z.json>>;

export function publicApiSchema(input: unknown) {
  const document = documentSchema.parse(input);
  const paths = Object.fromEntries(
    Object.entries(document.paths).filter(
      ([path]) => !path.startsWith("/api/admin/"),
    ),
  );
  const usedSchemas = new Set<string>();
  const visit = (value: JsonValue): void => {
    if (Array.isArray(value)) {
      value.forEach(visit);
    } else if (value !== null && typeof value === "object") {
      const reference = value.$ref;
      if (
        typeof reference === "string" &&
        reference.startsWith("#/components/schemas/")
      ) {
        const name = reference.slice("#/components/schemas/".length);
        if (!usedSchemas.has(name)) {
          usedSchemas.add(name);
          const schema = document.components.schemas[name];
          if (schema !== undefined) visit(schema);
        }
      }
      Object.values(value).forEach(visit);
    }
  };
  visit(paths);
  return {
    ...document,
    paths,
    components: {
      ...document.components,
      schemas: Object.fromEntries(
        Object.entries(document.components.schemas).filter(([name]) =>
          usedSchemas.has(name),
        ),
      ),
    },
  };
}
