import type { IPersistor } from '../IPersistor';

export class LocalStoragePersistor<T extends object> implements IPersistor<T> {
  data: T | undefined;

  readonly key: string;
  constructor() {
    this.key = 'noop';
    this.data = undefined;
  }

  getKey(): string {
    return this.key;
  }

  async persist(data: T): Promise<void> {
    this.data = data;
  }

  async restore(): Promise<T | undefined> {
    return this.data;
  }
}
