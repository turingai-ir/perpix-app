const channel = (hex: string, offset: number) => {
  const full =
    hex.length === 4 ? `#${[...hex.slice(1)].map((c) => c + c).join("")}` : hex;
  return parseInt(full.slice(1 + offset * 2, 3 + offset * 2), 16);
};

/** `from` mixed toward `to` by `amount`, both as #rrggbb or #rgb. */
export const mixColors = (from: string, to: string, amount: number): string => {
  const mixed = [0, 1, 2].map((i) =>
    Math.round(channel(from, i) + (channel(to, i) - channel(from, i)) * amount)
      .toString(16)
      .padStart(2, "0"),
  );
  return `#${mixed.join("")}`;
};

/** A #rrggbb or #rgb colour as `rgba(...)`, for gradients that fade to clear. */
export const withAlpha = (hex: string, alpha: number): string =>
  `rgba(${channel(hex, 0)}, ${channel(hex, 1)}, ${channel(hex, 2)}, ${alpha})`;
