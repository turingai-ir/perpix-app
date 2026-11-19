import type { CaptionTemplate } from "./template";
import type { CaptionPage, CaptionWord } from "./words";

export const NORMAL_ROLE = "normal";

const letters = (text: string) => text.replace(/[^\p{L}\p{N}]/gu, "");

/**
 * The role a word is drawn in: set on the word (by hand or by a model), else
 * `emphasis` meaning `key`, else the first of the template's rules that fits.
 * A role the template does not define falls back to the normal one.
 */
export const roleOf = (
  word: CaptionWord,
  page: CaptionPage,
  template: CaptionTemplate,
): string => {
  const known = (role: string) =>
    role === NORMAL_ROLE || role in template.roles ? role : NORMAL_ROLE;
  if (word.role) return known(word.role);
  if (word.emphasis) return known("key");
  for (const rule of template.roleRules) {
    if (rule.when === "number" && /\p{N}/u.test(word.text))
      return known(rule.role);
    if (rule.when === "last" && page.words[page.words.length - 1] === word) {
      return known(rule.role);
    }
    if (rule.when === "longest" && page.words.length > 1) {
      let longest = page.words[0];
      for (const candidate of page.words) {
        if (
          longest &&
          letters(candidate.text).length > letters(longest.text).length
        ) {
          longest = candidate;
        }
      }
      if (longest === word) return known(rule.role);
    }
  }
  return NORMAL_ROLE;
};
