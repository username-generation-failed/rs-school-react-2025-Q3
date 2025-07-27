import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APP_ERROR_TYPE, UnexpectedError } from '~lib/Errors';
import type { AsyncStatus, IAsyncCommand } from '~lib/types';
import type { IAppError, AsyncState } from '~lib/types';
import { deAsync, guard } from '~utils';

export type RequestFromCommand<C> =
  C extends IAsyncCommand<infer P, unknown> ? (params: P) => void : never;

export type Props<P, R> = {
  command: IAsyncCommand<P, R>;
};

export type AsyncStateByStatus<T, S> = S extends 'idle'
  ? {
      error?: undefined;
      result?: undefined;
      status: 'idle';
    }
  : S extends 'pending'
    ? {
        error?: IAppError;
        result?: T;
        status: 'pending';
      }
    : S extends 'success'
      ? {
          error?: undefined;
          result: T;
          status: 'success';
        }
      : S extends 'error'
        ? {
            error: IAppError;
            result?: undefined;
            status: 'error';
          }
        : never;

type PassProps<P, R> = { state: AsyncState<R>; request: (params: P) => void };

export function is<T, S extends AsyncStatus>(
  state: AsyncState<T>,
  status: S
): state is AsyncStateByStatus<T, S> {
  return state.status === status;
}

export const useAsyncCommand = <P, R>(
  command: IAsyncCommand<P, R>
): PassProps<P, R> => {
  const abortControllerRef = useRef<AbortController | undefined>(undefined);

  const [state, setState] = useState<AsyncState<R>>({
    status: 'idle',
    error: undefined,
    result: undefined,
  });

  const handleRequestAsync = useCallback(
    async (params: P) => {
      if (abortControllerRef.current !== undefined) {
        abortControllerRef.current.abort();
      }
      const abortController = new AbortController();
      try {
        abortControllerRef.current = abortController;
        setState({ status: 'pending' });

        const result = await command.exec(params, abortController.signal);

        setState({ status: 'success', error: undefined, result });
      } catch (error) {
        if (abortController?.signal.aborted) {
          return;
        }

        if (
          guard<IAppError>()(
            error,
            'object',
            (value) => 'type' in value && value.type === APP_ERROR_TYPE
          )
        ) {
          setState({
            status: 'error',
            error,
            result: undefined,
          });
          return;
        }

        console.log(error);

        if (guard<Error>()(error, 'object', (value) => 'message' in value)) {
          setState({
            status: 'error',
            error: new UnexpectedError(error.message),
            result: undefined,
          });
          return;
        }

        setState({
          status: 'error',
          error: new UnexpectedError(
            "If only we knew what it is, but we don't know what it is. It's not even an error .·°՞(≧□≦)՞°·."
          ),
          result: undefined,
        });
      } finally {
        abortControllerRef.current = undefined;
      }
    },
    [command]
  );
  const handleRequest = useMemo(
    () => deAsync(handleRequestAsync),
    [handleRequestAsync]
  );

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const result = useMemo<PassProps<P, R>>(
    () => ({
      state,
      request: handleRequest,
    }),
    [handleRequest, state]
  );

  return result;
};
