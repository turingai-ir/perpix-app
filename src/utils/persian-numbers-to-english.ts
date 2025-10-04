export const persianNumbersToEnglish = (str: string) => {
  return str.replace(/[\u06F0-\u06F9\u0660-\u0669]/g, (char) => {
    const code = char.charCodeAt(0);
    // Persian digits: \u06F0 - \u06F9 → 0-9
    if (code >= 0x06f0 && code <= 0x06f9) {
      return (code - 0x06f0).toString();
    }
    // Arabic digits: \u0660 - \u0669 → 0-9
    if (code >= 0x0660 && code <= 0x0669) {
      return (code - 0x0660).toString();
    }
    return char;
  });
};
