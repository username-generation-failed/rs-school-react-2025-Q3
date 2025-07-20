import { assert } from '~utils';

export interface ICountingSync {
  increment(value?: number): void;
  decrement(value?: number): void;
  wait(): Promise<void>;
}

export class CountingSync implements ICountingSync {
  private counter = 0;
  // eslint issue. "void is only valid as a return type or generic type argument."
  // this is generic type argument
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  private promiseWithResolvers = Promise.withResolvers<void>();

  increment(): void {
    this.counter++;
  }
  decrement(): void {
    this.counter--;
    if (this.counter === 0) {
      this.promiseWithResolvers.resolve();
    }
    assert(this.counter >= 0, 'counter must be positive');
  }
  async wait(): Promise<void> {
    if (this.counter === 0) return;

    await this.promiseWithResolvers.promise;
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    this.promiseWithResolvers = Promise.withResolvers<void>();
  }
}
