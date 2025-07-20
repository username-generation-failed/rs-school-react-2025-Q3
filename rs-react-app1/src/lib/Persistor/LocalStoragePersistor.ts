import type { IPersistor } from './IPersistor';

export class LocalStoragePersistor<T extends object> implements IPersistor<T> {
  readonly key: string;
  constructor(key: string) {
    this.key = key;
  }
  getKey(): string {
    return this.key;
  }

  async persist(data: T): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  async restore(): Promise<T | undefined> {
    const result = localStorage.getItem(this.key);
    if (result === null) return undefined;
    return JSON.parse(result);
  }
}
