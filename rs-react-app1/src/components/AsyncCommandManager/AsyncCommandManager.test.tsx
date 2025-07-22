import { afterAll, describe, expect, it, vi } from 'vitest';
import { act, render } from '~test-utils/testing-react';
import { AsyncCommandManager, type Props } from './AsyncCommandManager';
import { faker } from '@faker-js/faker';
import type { AsyncState, IAsyncCommand } from '~lib/types';
import { RequestError, UnexpectedError } from '~lib/Errors';

const commandMock = {
  exec: vi.fn(),
};

commandMock satisfies IAsyncCommand;

const childMock = (props: AsyncState<unknown>) => {
  return (
    <div key={props.status} data-testid={props.status}>
      {props.status}
    </div>
  );
};

const renderChildMock = vi.fn<Props<unknown, unknown>['children']>(childMock);
const log = console.log;
console.log = vi.fn();

afterAll(() => {
  console.log = log;
});

const setup = async () => {
  let handleRequest: <P>(params: P) => void = () => {};
  const setRequest = (request: (params: unknown) => void) => {
    handleRequest = request;
  };
  const utils = await act(async () =>
    render(
      <AsyncCommandManager command={commandMock} exposeRequest={setRequest}>
        {renderChildMock}
      </AsyncCommandManager>
    )
  );

  return {
    utils,
    request: handleRequest,
  };
};

describe('AsyncCommandManager', {}, () => {
  it('Pass idle state', async () => {
    await setup();
    expect(renderChildMock).lastCalledWith({
      error: undefined,
      status: 'idle',
      result: undefined,
    });
  });

  it('Pass pending state', async () => {
    const withResolvers = Promise.withResolvers();
    commandMock.exec.mockResolvedValue(withResolvers.promise);

    const { request } = await setup();

    await act(async () => request(1));

    expect(renderChildMock).lastCalledWith({
      error: undefined,
      status: 'pending',
      result: undefined,
    });
    await act(async () => withResolvers.resolve(1));
  });

  it('Pass success state', async () => {
    const result = faker.word.noun();
    commandMock.exec.mockResolvedValue(result);

    const { request } = await setup();

    await act(async () => request(1));

    expect(renderChildMock).lastCalledWith({
      error: undefined,
      status: 'success',
      result,
    });
  });

  it('Pass through AppError', async () => {
    const err = new RequestError('mock request error');
    commandMock.exec.mockRejectedValue(err);

    const { request } = await setup();

    await act(async () => request(1));

    expect(renderChildMock).lastCalledWith({
      error: err,
      status: 'error',
      result: undefined,
    });
  });

  it('Handle unexpected error', async () => {
    const err = new Error('mock scarry error');
    commandMock.exec.mockRejectedValue(err);

    const { request } = await setup();

    await act(async () => request(1));

    expect(renderChildMock).lastCalledWith({
      error: new UnexpectedError(err.message),
      status: 'error',
      result: undefined,
    });
    expect(console.log).toBeCalled();
  });

  it('Handle unexpected something', async () => {
    const err = 'I identify myself as an Error';
    commandMock.exec.mockRejectedValue(err);

    let exposePass: AsyncState<unknown> | undefined;
    renderChildMock.mockImplementation((pass) => {
      exposePass = pass;
      return null;
    });

    const { request } = await setup();

    await act(async () => request(1));

    expect(exposePass).not.toBe(undefined);
    expect(exposePass?.error?.name).toBe(UnexpectedError.name);
    expect(console.log).toBeCalled();
  });
});
