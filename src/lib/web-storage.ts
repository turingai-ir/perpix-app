export interface WebStorage {
  get: <T extends string>(key: string) => Promise<T | undefined> | T | undefined;
  set: <T extends string>(key: string, value: T) => Promise<void> | void;
  delete: (key: string) => Promise<void> | void;
  clear: () => Promise<void> | void;
  keys: () => Promise<string[]> | string[];
  has: (key: string) => Promise<boolean> | boolean;
}

export class LocalStorageAdapter implements WebStorage {
  constructor(private debugging: boolean = false) {}
  public get<T>(key: string): T | undefined {
    const item = localStorage.getItem(key);
    return item as T | undefined;
  }

  public set<T extends string>(key: string, value: T): void {
    localStorage.setItem(key, value);
  }

  public delete(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }

  public keys(): string[] {
    return Object.keys(localStorage);
  }

  public has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }
}
