import { isRtl } from "./words";

type Direction = "ltr" | "rtl";

function firstLetterDirection(text: string): Direction | undefined {
  const letter = text.match(/\p{Letter}/u)?.[0];
  if (letter) return isRtl(letter) ? "rtl" : "ltr";
}

export function captionDirection(words: readonly string[]): Direction {
  for (const word of words) {
    const direction = firstLetterDirection(word);
    if (direction) return direction;
  }
  return "ltr";
}

/** Visual order for separate Persian and Latin word runs on one caption line. */
export function visualWordOrder(
  words: readonly string[],
  base: Direction,
): number[] {
  const runs: Array<{ direction: Direction; indices: number[] }> = [];
  const append = (index: number, direction: Direction) => {
    const last = runs[runs.length - 1];
    if (last?.direction === direction) last.indices.push(index);
    else runs.push({ direction, indices: [index] });
  };

  let previous = base;
  let nextIndex = 0;
  for (let index = 0; index < words.length; index++) {
    const text = words[index];
    const direction = firstLetterDirection(text) ?? (/\p{Number}/u.test(text) ? "ltr" : undefined);
    if (!direction) continue;
    const neutral = previous === direction ? direction : base;
    while (nextIndex < index) append(nextIndex++, neutral);
    append(index, direction);
    nextIndex = index + 1;
    previous = direction;
  }
  while (nextIndex < words.length) append(nextIndex++, base);

  if (base === "rtl") runs.reverse();
  return runs.flatMap(({ direction, indices }) =>
    direction === "rtl" ? indices.reverse() : indices,
  );
}
