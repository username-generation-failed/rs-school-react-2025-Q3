export interface IWaitHandle {
  wait(): Promise<void>;
  notifyAll(): void;
}
