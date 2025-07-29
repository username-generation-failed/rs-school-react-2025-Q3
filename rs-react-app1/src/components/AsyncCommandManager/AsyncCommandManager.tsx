import React, { useEffect } from 'react';
import type { IAsyncCommand } from '~lib/types';
import type { AsyncState } from '~lib/types';
import { useAsyncCommand } from './useAsyncCommand';

export type RequestFromCommand<C> =
  C extends IAsyncCommand<infer P, unknown> ? (params: P) => void : never;

export type Props<P, R> = {
  command: IAsyncCommand<P, R>;
  exposeRequest: (request: (params: P) => void) => void;
  children: (passProps: Readonly<PassProps<R>>) => React.ReactNode;
};

type PassProps<R> = AsyncState<R>;

export const AsyncCommandManager = <P, R>(props: Props<P, R>) => {
  const { command, exposeRequest } = props;
  const { request, state } = useAsyncCommand(command);

  useEffect(() => {
    exposeRequest(request);
  }, [exposeRequest, request]);

  return props.children(state);
};
