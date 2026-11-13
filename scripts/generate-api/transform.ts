// scripts/generate-api/transform.ts
import ts from "typescript";

/**
 * Simple and robust transform for binary fields.
 * Converts:
 *   type: string, format: binary  → File
 *   type: array, items.format: binary → File[]
 */
export function makeBinaryTransform(target: "File" | "Blob" = "File") {
  const TARGET = ts.factory.createTypeReferenceNode(target);
  const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());

  const isBinaryString = (s: any) =>
    s?.type === "string" && s?.format === "binary";

  const isBinaryArray = (s: any) =>
    s?.type === "array" &&
    s?.items?.type === "string" &&
    s?.items?.format === "binary";

  return function transform(schema: any): ts.TypeNode | undefined {
    // string($binary) → File | File | null
    if (isBinaryString(schema)) {
      return schema.nullable
        ? ts.factory.createUnionTypeNode([TARGET, NULL])
        : TARGET;
    }

    // array<string($binary)> → File[] | File[] | null
    if (isBinaryArray(schema)) {
      const ARR = ts.factory.createArrayTypeNode(TARGET);
      return schema.nullable
        ? ts.factory.createUnionTypeNode([ARR, NULL])
        : ARR;
    }

    // else → untouched
  };
}

const JSON_DIRECTIONS = ["Input", "Output"] as const;

/**
 * Recursive JSON schemas cannot be expressed through indexed access on
 * `components["schemas"]` (TS2502), so they are emitted as top-level aliases.
 */
export function jsonAliasName(schemaPath: string): string | undefined {
  const match =
    /\/components\/schemas\/(Json(?:Value|Object|Array))-(Input|Output)$/.exec(
      schemaPath,
    );
  return match ? `${match[1]}${match[2]}` : undefined;
}

export const JSON_ALIASES_SOURCE = JSON_DIRECTIONS.map(
  (d) => `export type JsonValue${d} =
  | JsonObject${d}
  | JsonArray${d}
  | string
  | number
  | boolean
  | null;
export type JsonObject${d} = { readonly [key: string]: JsonValue${d} };
export type JsonArray${d} = readonly JsonValue${d}[];`,
).join("\n\n");

export function makeJsonPostTransform() {
  return function postTransform(
    _type: ts.TypeNode,
    options: { path?: string },
  ): ts.TypeNode | undefined {
    const name = options.path ? jsonAliasName(options.path) : undefined;
    return name ? ts.factory.createTypeReferenceNode(name) : undefined;
  };
}
