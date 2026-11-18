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

/**
 * Recursive JSON schemas (JsonValue -> JsonArray -> JsonValue) are emitted as
 * interface properties, which TypeScript rejects as circular (TS2502).
 * Break the cycle by typing the container elements as `unknown`; JsonValue
 * stays the precise union of the (now non-circular) members.
 */
export function makeJsonCycleTransform() {
  const UNKNOWN = ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword);

  return function transform(
    _schema: unknown,
    options?: { path?: string },
  ): ts.TypeNode | undefined {
    const name = options?.path?.split("/").pop();
    if (options?.path?.startsWith("#/components/schemas/") !== true) return;

    if (name === "JsonArray") {
      return ts.factory.createTypeOperatorNode(
        ts.SyntaxKind.ReadonlyKeyword,
        ts.factory.createArrayTypeNode(UNKNOWN),
      );
    }
    if (name === "JsonObject") {
      return ts.factory.createTypeLiteralNode([
        ts.factory.createIndexSignature(
          [ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
          [
            ts.factory.createParameterDeclaration(
              undefined,
              undefined,
              "key",
              undefined,
              ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            ),
          ],
          UNKNOWN,
        ),
      ]);
    }
  };
}
