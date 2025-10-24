// scripts/generate-api/transform.ts
import ts from 'typescript';

/**
 * Simple and robust transform for binary fields.
 * Converts:
 *   type: string, format: binary  → File
 *   type: array, items.format: binary → File[]
 */
export function makeBinaryTransform(target: 'File' | 'Blob' = 'File') {
  const TARGET = ts.factory.createTypeReferenceNode(target);
  const NULL = ts.factory.createLiteralTypeNode(ts.factory.createNull());

  const isBinaryString = (s: any) => s?.type === 'string' && s?.format === 'binary';

  const isBinaryArray = (s: any) =>
    s?.type === 'array' && s?.items?.type === 'string' && s?.items?.format === 'binary';

  return function transform(schema: any): ts.TypeNode | undefined {
    // string($binary) → File | File | null
    if (isBinaryString(schema)) {
      return schema.nullable ? ts.factory.createUnionTypeNode([TARGET, NULL]) : TARGET;
    }

    // array<string($binary)> → File[] | File[] | null
    if (isBinaryArray(schema)) {
      const ARR = ts.factory.createArrayTypeNode(TARGET);
      return schema.nullable ? ts.factory.createUnionTypeNode([ARR, NULL]) : ARR;
    }

    // else → untouched
  };
}
