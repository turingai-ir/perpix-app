import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/* Design-language roles from `styles/theme.css`; keep both lists in sync. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "large-title",
        "title-1",
        "title-2",
        "title-3",
        "headline",
        "body",
        "subhead",
        "footnote",
        "caption",
      ],
      radius: ["control", "card", "overlay"],
      shadow: ["raised", "overlay", "modal"],
      "inset-shadow": ["highlight-sm", "highlight", "highlight-lg"],
      spacing: ["inset-sm", "inset", "inset-lg", "group", "block", "section"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
