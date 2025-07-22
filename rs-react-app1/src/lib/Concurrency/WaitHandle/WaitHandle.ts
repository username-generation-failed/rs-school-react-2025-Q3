import type { IWaitHandle } from './IWaitHandle';

//this impl don't need notifyOne and thus could be simplified to use only one promise for all wait calls
export class WaitHandle implements IWaitHandle {
  private promiseWithResolvers: PromiseWithResolvers<void> =
    Promise.withResolvers();

  wait(): Promise<void> {
    return this.promiseWithResolvers.promise;
  }
  notifyAll(): void {
    this.promiseWithResolvers.resolve();
    this.promiseWithResolvers = Promise.withResolvers();
  }
}
