export interface IPersistor<T extends object = object> {
  getKey(): string;
  persist(data: T): Promise<void>;
  restore(): Promise<T | undefined>;
}
