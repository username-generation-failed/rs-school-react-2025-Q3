import type { IWaitHandle } from './IWaitHandle';

//this impl don't need notifyOne and thus could be simplified to use only one promise for all wait calls
export class WaitHandle implements IWaitHandle {
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  private promiseWithResolvers = Promise.withResolvers<void>();

  wait(): Promise<void> {
    return this.promiseWithResolvers.promise;
  }
  notifyAll(): void {
    this.promiseWithResolvers.resolve();
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
    this.promiseWithResolvers = Promise.withResolvers<void>();
  }
}
