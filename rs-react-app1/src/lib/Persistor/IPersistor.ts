export interface IPersistor<T extends object = object> {
  persist(data: T): Promise<void>;
  restore(): Promise<T | undefined>;
}
