import React from 'react';
import { APP_ERROR_TYPE, UnexpectedError } from '~lib/Errors';
import type { IAsyncCommand } from '~lib/types';
import type { IAppError, AsyncState, AsyncStatus } from '~lib/types';
import { guard } from '~utils';

export type RequestFromCommand<C> =
  C extends IAsyncCommand<infer P, unknown> ? (params: P) => void : never;

export type Props<P, R> = {
  command: IAsyncCommand<P, R>;
  exposeRequest: (request: (params: P) => void) => void;
  children: (passProps: Readonly<PassProps<R>>) => React.ReactNode;
};

type AsyncStateByStatus<T, S> = S extends 'idle'
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
    : S extends 'sucess'
      ? {
          error?: undefined;
          result: T;
          status: 'sucess';
        }
      : S extends 'error'
        ? {
            error: IAppError;
            result?: undefined;
            status: 'error';
          }
        : never;

type PassProps<R> = AsyncState<R> & {
  is<S extends AsyncStatus>(
    this: AsyncState<R>,
    status: S
  ): this is AsyncStateByStatus<R, S>;
};

type State<R> = PassProps<R>;
function is<T, S>(
  this: AsyncState<T>,
  status: S
): this is AsyncStateByStatus<T, S> {
  return this.status === status;
}

export class AsyncCommandManager<P, R> extends React.PureComponent<
  Props<P, R>,
  State<R>
> {
  abortController: AbortController | undefined;

  constructor(props: Props<P, R>) {
    super(props);
    this.state = {
      status: 'idle',
      error: undefined,
      result: undefined,
      is: is,
    };

    this.props.exposeRequest(this.handleRequest);
    this.abortController = undefined;
  }

  componentWillUnmount(): void {
    this.abortController?.abort();
  }

  handleRequest = (params: P) => {
    this.handleRequestAsync(params);
  }
  handleRequestAsync = async (params: P) => {
    try {
      this.abortController = new AbortController();
      this.setState({ status: 'pending' });

      const result = await this.props.command.exec(
        params,
        this.abortController.signal
      );

      this.setState({ status: 'sucess', error: undefined, result });
    } catch (error) {
      if (this.abortController?.signal.aborted) {
        return;
      }

      if (
        guard<IAppError>()(
          error,
          'object',
          (value) => 'type' in value && value.type === APP_ERROR_TYPE
        )
      ) {
        this.setState({
          status: 'error',
          error,
          result: undefined,
        });
        return;
      }

      console.log(error);

      if (guard<Error>()(error, 'object', (value) => 'message' in value)) {
        this.setState({
          status: 'error',
          error: new UnexpectedError(error.message),
          result: undefined,
        });
        return;
      }

      this.setState({
        status: 'error',
        error: new UnexpectedError(
          "If only we knew what it is, but we don't know what it is. It's not even an error .·°՞(≧□≦)՞°·."
        ),
        result: undefined,
      });
    } finally {
      this.abortController = undefined;
    }
  };

  render(): React.ReactNode {
    return this.props.children(this.state);
  }
}
