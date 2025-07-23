import { assert } from '~utils';

export interface ICountingSync {
  increment(value?: number): void;
  decrement(value?: number): void;
  wait(): Promise<void>;
}

export class CountingSync implements ICountingSync {
  private counter = 0;
  private promiseWithResolvers = Promise.withResolvers();

  increment(): void {
    this.counter++;
  }
  decrement(): void {
    this.counter--;
    if (this.counter === 0) {
      this.promiseWithResolvers.resolve(undefined);
    }
    assert(this.counter >= 0, 'counter must be positive');
  }
  async wait(): Promise<void> {
    if (this.counter === 0) return;

    await this.promiseWithResolvers.promise;
    this.promiseWithResolvers = Promise.withResolvers();
  }
}
