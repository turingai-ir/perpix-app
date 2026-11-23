import { format } from "oxfmt";
import config from "./oxfmt.mjs";

/**
 * Format generated source explicitly, without CLI ignore patterns.
 * @param {string} fileName
 * @param {string} source
 * @returns {Promise<string>}
 */
export async function formatSource(fileName, source) {
  const { ignorePatterns, ...options } = config;
  const result = await format(fileName, source, options);
  if (result.errors.length > 0) {
    throw new Error(result.errors.map((error) => error.message).join("\n"));
  }
  return result.code;
}
