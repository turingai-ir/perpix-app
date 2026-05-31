/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs/promises";
import path from "path";

import openapiTS, { astToString } from "openapi-typescript";

import { makeBinaryTransform } from "./transform";

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

const OPENAPI_URL = "http://localhost:8000/openapi.json";
const TEMP_DIR = path.resolve("./scripts/generate-api/_output");
const TEMP_OPENAPI_JSON_PATH = path.join(TEMP_DIR, "openapi.json");
const TEMP_API_OUTPUT_PATH = path.join(TEMP_DIR, "api.ts");
const FINAL_API_OUTPUT_PATH = path.resolve("./src/services/api/api.ts");

const downloadOpenApiSchema = async (url: string, targetPath: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch OpenAPI schema from "${url}": ${response.status} ${response.statusText}`,
    );
  }

  const schema = await response.text();

  await fs.mkdir(path.dirname(targetPath), { recursive: true });
  await fs.writeFile(targetPath, schema, "utf-8");

  return targetPath;
};

const isEnumValueList = (value: unknown): value is Array<string | number> =>
  Array.isArray(value) &&
  value.every((item) => typeof item === "string" || typeof item === "number");

const resolveEnumKeys = (schema: SchemaLike, values: Array<string | number>) => {
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

const collectEnumMaps = async (generatedJsonFileFullPath: string): Promise<EnumDef[]> => {
  const content = JSON.parse(await fs.readFile(generatedJsonFileFullPath, "utf-8"));
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
        .map((key, index) => `  ${JSON.stringify(key)}: ${JSON.stringify(enumDef.values[index])},`)
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

const generateClient = async (generatedJsonFileFullPath: string, outputFilePath: string) => {
  const ast = await openapiTS(new URL(`file://${generatedJsonFileFullPath}`), {
    enum: false,
    enumValues: true,
    immutable: true,
    makePathsEnum: false,
    generatePathParams: true,
    rootTypes: true,
    transform: makeBinaryTransform("File"),
  });

  const enumMaps = renderEnumMaps(await collectEnumMaps(generatedJsonFileFullPath));
  const output = [astToString(ast), enumMaps].filter(Boolean).join("\n\n");

  await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
  await fs.writeFile(outputFilePath, output, "utf-8");

  return outputFilePath;
};

const copyGeneratedApiToService = async (generatedApiPath: string, serviceApiPath: string) => {
  await fs.mkdir(path.dirname(serviceApiPath), { recursive: true });
  await fs.copyFile(generatedApiPath, serviceApiPath);

  return serviceApiPath;
};

const main = async () => {
  const schemaPath = await downloadOpenApiSchema(OPENAPI_URL, TEMP_OPENAPI_JSON_PATH);
  const generatedFilePath = await generateClient(schemaPath, TEMP_API_OUTPUT_PATH);
  const finalFilePath = await copyGeneratedApiToService(generatedFilePath, FINAL_API_OUTPUT_PATH);

  console.log(`Generated API types at ${generatedFilePath}`);
  console.log(`Copied generated API types to ${finalFilePath}`);
};

void main();
