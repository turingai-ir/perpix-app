// scripts/generate-api/generate.ts
import fs from 'fs/promises';
import path from 'path';

import openapiTS, { astToString } from 'openapi-typescript';

import { makeBinaryTransform } from './transform';

const generateClient = async (url: string, fileName: string) => {
  const ast = await openapiTS(new URL(url, import.meta.url), {
    enum: true,
    enumValues: true,
    immutable: true,
    makePathsEnum: true,
    generatePathParams: true,
    rootTypes: true,
    transform: makeBinaryTransform('File'),
  });

  const outputDir = path.resolve('./scripts/generate-api/_output');
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(path.join(outputDir, `${fileName}.ts`), astToString(ast));
};

const main = async () => {
  await generateClient('http://localhost:8000/openapi.json', 'api');
};
main();
