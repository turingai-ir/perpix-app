import openapiTS, { astToString } from "openapi-typescript";
import fs from "fs/promises";

/**
 * Generates a TypeScript client from an OpenAPI schema and writes it to a file.
 * @param url The URL of the OpenAPI schema.
 * @param fileName The name of the file to write, without the extension.
 * @returns A Promise that resolves when the file has been written.
 */
const generateClient = async (url: string, fileName: string): Promise<void> => {
  const ast = await openapiTS(new URL(url, import.meta.url), {
    enum: true,
    enumValues: true,
    immutable: true,
    makePathsEnum: true,
    generatePathParams: true,
    rootTypes: true,
  } as const);

  const path = `./scripts/generate-api/_output/`;
  const writePath = `${path}${fileName}.ts`;

  // Ensure the output directory exists and write the file
  await fs.mkdir(path, { recursive: true });
  await fs.writeFile(writePath, astToString(ast));
};

/**
 * The main entry point of this script.
 * Prompts the user to select an OpenAPI schema using the `openApiSchemaPicker` function,
 * and then generates a TypeScript client based on the selected schema URL.
 */

const main = async () => {
  await generateClient("http://localhost:8000/openapi.json", "api");
};

main();
