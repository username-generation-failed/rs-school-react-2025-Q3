import { remove } from '~utils/Array';
import type { ICachedPersistor } from './ICachedPersistor';
import type { IPersistor } from './IPersistor';
import { WaitHandle } from '~lib/Concurrency/WaitHandle';

// optimistic approach in solving concurrency problem
//    assume persistor.persist won't error
//    alternative might be to block restore() before persist() is finished
// if persistor is synchronous it's 100% safe
// if it's asynchronous it's safe until you don't persist() optimistic data before it's comitted
// that's why it's important to persist mutated previous data rather than a copy
//   ofc alternative could be a deep comparison
export class WithOptimisticShallowCachePersistor<T extends object>
  implements ICachedPersistor<T>
{
  persistor: IPersistor<T>;
  prevData?: T;
  optimisticDataContainer: T[];
  waitHandle = new WaitHandle();

  constructor(persistor: IPersistor<T>) {
    this.persistor = persistor;
    this.prevData = undefined;
    this.optimisticDataContainer = [];
  }

  getKey(): string {
    return this.persistor.getKey();
  }

  async persist(data: T): Promise<void> {
    if (this.prevData !== undefined) return;
    while (this.optimisticDataContainer.includes(data)) {
      await this.waitHandle.wait();
    }

    this.prevData = data;
    this.optimisticDataContainer.push(data);

    await this.persistor.persist(data);

    const index = remove(this.optimisticDataContainer, data);
    if (index !== -1) {
      this.waitHandle.notifyAll();
    }
  }

  async restore(): Promise<T | undefined> {
    if (this.prevData !== undefined) return this.prevData;

    this.prevData = await this.persistor.restore();
    return this.prevData;
  }

  invalidate(): void {
    this.prevData = undefined;
  }
}
