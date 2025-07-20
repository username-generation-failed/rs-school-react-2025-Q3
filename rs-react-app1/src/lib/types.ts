export interface IAsyncCommand<P = unknown, R = unknown> {
  exec(params: P, signal: AbortSignal): Promise<R>;
}

export type IAppError = {
  type: 'ApplicationErrorDto';
  message: string;
  name: string;
  humanFriendlyMessage?: string;
};

export type AsyncStatus = 'idle' | 'pending' | 'sucess' | 'error';

export type AsyncState<T> = {
  error?: IAppError;
  result?: T;
  status: AsyncStatus;
};
