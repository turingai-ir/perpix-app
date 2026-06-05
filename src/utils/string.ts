export function simplifyAspect(size: string): string {
  const [w, h] = size.split("x").map(Number);
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const d = gcd(w, h);

  const rw = Math.round(w / d);
  const rh = Math.round(h / d);

  return `${rw}:${rh}`;
}

export function convertToStorageUrl(path: string) {
  return `${import.meta.env.VITE_S3_ENDPOINT}/${path}`;
}
