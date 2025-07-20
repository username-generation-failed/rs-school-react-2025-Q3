import type { IPersistor } from './IPersistor';

export interface ICachedPersistor<T extends object> extends IPersistor<T> {
  invalidate(): void;
}
