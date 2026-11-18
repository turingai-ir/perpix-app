import fs from "fs/promises";
import path from "path";
import { execFileSync } from "child_process";

import openapiTS, { astToString } from "openapi-typescript";
import prettier from "prettier";

import { adminApiSchema } from "./admin-schema";
import { makeBinaryTransform, makeJsonCycleTransform } from "./transform";

type EnumDef = {
  name: string;
  keys: Array<string | number>;
  values: Array<string | number>;
};

type SchemaLike = {
  enum?: unknown;
  "x-enum-varnames"?: unknown;
  "x-enumNames"?: unknown;
};

try {
  process.loadEnvFile();
} catch {
  /* .env file optional */
}

const API_BASE_URL = process.env.VITE_PERPIX_API_URL || "http://localhost:8000";
const OPENAPI_URL =
  process.env.OPENAPI_URL ||
  `${API_BASE_URL.replace(/\/+$/, "")}/api-admin-schema-6f47a9d2c18b4e30.json`;
const TEMP_DIR = path.resolve("./scripts/generate-api/_output");
const TEMP_OPENAPI_JSON_PATH = path.join(TEMP_DIR, "openapi.json");
const TEMP_API_OUTPUT_PATH = path.join(TEMP_DIR, "api.ts");
const FINAL_API_OUTPUT_PATH = path.resolve("./src/services/api/api.ts");
const CORE_API_DIR = path.resolve("../perpix-core-api");

const downloadOpenApiSchema = async (targetPath: string) => {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });

  // 1. Try fetching from OPENAPI_URL
  try {
    const response = await fetch(OPENAPI_URL, {
      signal: AbortSignal.timeout(3000),
    });

    if (response.ok) {
      const raw = adminApiSchema(await response.json());
      const publicResponse = await fetch(
        process.env.PUBLIC_OPENAPI_URL ||
          `${API_BASE_URL.replace(/\/+$/, "")}/api-schema-6f47a9d2c18b4e30.json`,
        { signal: AbortSignal.timeout(5000) },
      );
      if (!publicResponse.ok)
        throw new Error("Could not load authentication schema");
      const auth = adminApiSchema(await publicResponse.json());
      const schema = JSON.stringify(
        {
          ...raw,
          paths: { ...raw.paths, ...auth.paths },
          components: {
            ...raw.components,
            schemas: { ...raw.components.schemas, ...auth.components.schemas },
          },
        },
        null,
        2,
      );
      await fs.writeFile(targetPath, schema, "utf-8");
      return targetPath;
    }
  } catch {
    // HTTP fetch skipped or failed
  }

  // 2. Try generating directly from local perpix-core-api Python if available
  const pythonVenv = path.join(CORE_API_DIR, ".venv/bin/python");
  try {
    await fs.access(pythonVenv);
    const pyScript = `
from perpix_core_api.main import build_openapi_schema, ADMIN_API_PREFIX, PUBLIC_API_PREFIX
import json

admin = build_openapi_schema(ADMIN_API_PREFIX)
public = build_openapi_schema(PUBLIC_API_PREFIX)

merged_paths = dict(admin["paths"])
for path, item in public["paths"].items():
    if path.startswith("/api/v1/auth"):
        merged_paths[path] = item

merged_schemas = dict(admin.get("components", {}).get("schemas", {}))
for name, s in public.get("components", {}).get("schemas", {}).items():
    if name not in merged_schemas:
        merged_schemas[name] = s

schema = {
    "openapi": admin.get("openapi", "3.1.0"),
    "info": admin.get("info", {}),
    "paths": merged_paths,
    "components": {
        "schemas": merged_schemas
    }
}
print(json.dumps(schema))
`;
    const output = execFileSync(pythonVenv, ["-c", pyScript], {
      cwd: CORE_API_DIR,
      maxBuffer: 50 * 1024 * 1024,
    }).toString();

    const raw = JSON.parse(output);
    const schema = JSON.stringify(adminApiSchema(raw), null, 2);
    await fs.writeFile(targetPath, schema, "utf-8");
    return targetPath;
  } catch {
    // Python fallback skipped or failed
  }

  // 3. Fallback to existing local openapi.json if present
  try {
    const cached = adminApiSchema(
      JSON.parse(await fs.readFile(targetPath, "utf-8")),
    );
    if (!("/api/v1/auth/login" in cached.paths))
      throw new Error("Cached schema has no login contract");
    console.warn(
      "Using cached OpenAPI schema; backend schema could not be loaded.",
    );
    return targetPath;
  } catch {
    throw new Error(
      `Could not fetch OpenAPI schema from ${OPENAPI_URL} and no local schema found at ${targetPath}`,
    );
  }
};

const isEnumValueList = (value: unknown): value is Array<string | number> =>
  Array.isArray(value) &&
  value.every((item) => typeof item === "string" || typeof item === "number");

const resolveEnumKeys = (
  schema: SchemaLike,
  values: Array<string | number>,
) => {
  const varNames = schema["x-enum-varnames"];
  const enumNames = schema["x-enumNames"];

  if (isEnumValueList(varNames) && varNames.length === values.length) {
    return varNames;
  }

  if (isEnumValueList(enumNames) && enumNames.length === values.length) {
    return enumNames;
  }

  return values;
};

const collectEnumMaps = async (
  generatedJsonFileFullPath: string,
): Promise<EnumDef[]> => {
  const content = JSON.parse(
    await fs.readFile(generatedJsonFileFullPath, "utf-8"),
  );
  const schemas = content?.components?.schemas ?? {};
  const enums: EnumDef[] = [];

  Object.entries(schemas).forEach(([name, schema]: [string, any]) => {
    const values = schema?.enum;
    if (!isEnumValueList(values)) {
      return;
    }

    const keys = resolveEnumKeys(schema, values);
    enums.push({ name, keys, values });
  });

  return enums;
};

const renderEnumMaps = (enums: EnumDef[]) =>
  enums
    .map((enumDef) => {
      const entries = enumDef.keys
        .map(
          (key, index) =>
            `  ${JSON.stringify(key)}: ${JSON.stringify(enumDef.values[index])},`,
        )
        .join("\n");

      return [
        `export const ${enumDef.name}Map = {`,
        entries,
        "} as const;",
        `export type ${enumDef.name}Key = keyof typeof ${enumDef.name}Map;`,
        `export type ${enumDef.name}Value = (typeof ${enumDef.name}Map)[${enumDef.name}Key];`,
      ].join("\n");
    })
    .join("\n\n");

const binaryTransform = makeBinaryTransform("File");
const jsonCycleTransform = makeJsonCycleTransform();

const generateClient = async (
  generatedJsonFileFullPath: string,
  outputFilePath: string,
) => {
  const ast = await openapiTS(new URL(`file://${generatedJsonFileFullPath}`), {
    enum: false,
    enumValues: true,
    immutable: true,
    makePathsEnum: false,
    generatePathParams: true,
    rootTypes: true,
    transform: (schema, options) =>
      jsonCycleTransform(schema, options) ?? binaryTransform(schema),
  });

  const enumMaps = renderEnumMaps(
    await collectEnumMaps(generatedJsonFileFullPath),
  );
  let output = [astToString(ast), enumMaps].filter(Boolean).join("\n\n");
  try {
    const prettierConfig = await prettier.resolveConfig(outputFilePath);
    output = await prettier.format(output, {
      ...prettierConfig,
      filepath: outputFilePath,
    });
  } catch (err) {
    console.warn("Prettier format skipped for generated client:", err);
  }

  await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
  await fs.writeFile(outputFilePath, output, "utf-8");

  return outputFilePath;
};

const copyGeneratedApiToService = async (
  generatedApiPath: string,
  serviceApiPath: string,
) => {
  await fs.mkdir(path.dirname(serviceApiPath), { recursive: true });
  await fs.copyFile(generatedApiPath, serviceApiPath);

  return serviceApiPath;
};

const main = async () => {
  console.log("🔄 Resolving OpenAPI schema...");
  const schemaPath = await downloadOpenApiSchema(TEMP_OPENAPI_JSON_PATH);
  console.log(`📄 Using schema at: ${schemaPath}`);

  console.log(
    "⚙️  Generating TypeScript client types with AST transforms & Enum maps...",
  );
  const generatedFilePath = await generateClient(
    schemaPath,
    TEMP_API_OUTPUT_PATH,
  );

  const finalFilePath = await copyGeneratedApiToService(
    generatedFilePath,
    FINAL_API_OUTPUT_PATH,
  );

  console.log(`✅ Generated API types at: ${generatedFilePath}`);
  console.log(`🚀 Successfully published API types to: ${finalFilePath}`);
};

void main();
