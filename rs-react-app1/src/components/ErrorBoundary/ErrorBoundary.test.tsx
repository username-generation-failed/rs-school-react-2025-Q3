import { expect, describe, it, vi, afterEach } from 'vitest';
import { act, render, screen } from '~test-utils/testing-react';
import { ErrorBoundary } from './ErrorBoundary';
import userEvent from '@testing-library/user-event';
import { mockConsole } from '~test-utils/mockConsole';

const CHILD_TEST_ID = 'child';
const FALLBACK_TEST_ID = 'fallback';

const FallbackComponent = (props: { reset?: () => void }) => {
  const { reset } = props;
  return <div data-testid={FALLBACK_TEST_ID} onClick={reset} />;
};
const ChildComponent = () => <div data-testid={CHILD_TEST_ID} />;
const FallbackComponentMock = vi.fn(FallbackComponent);
const ChildComponentMock = vi.fn(ChildComponent);
const onErrorMock = vi.fn();

const setup = async () => {
  const utils = await act(async () =>
    render(
      <ErrorBoundary fallback={FallbackComponentMock} onError={onErrorMock}>
        <ChildComponentMock />
      </ErrorBoundary>
    )
  );

  return {
    utils,
  };
};

const setupRenderProps = async () => {
  const utils = await act(async () =>
    render(
      <ErrorBoundary
        fallback={({ reset }) => <FallbackComponentMock reset={reset} />}
        onError={onErrorMock}
      >
        <ChildComponentMock />
      </ErrorBoundary>
    )
  );

  return {
    utils,
  };
};

afterEach(() => {
  vi.resetAllMocks();
});

mockConsole('error');

describe('ErrorBoundary', {}, () => {
  it('Renders child success', async () => {
    await setup();

    expect(FallbackComponentMock).not.toBeCalled();
    expect(onErrorMock).not.toBeCalled();

    expect(screen.getByTestId(CHILD_TEST_ID)).toBeInTheDocument();
  });

  it('Catches error in child', async () => {
    ChildComponentMock.mockImplementation(() => {
      throw new Error();
    });

    await setup();

    expect(onErrorMock).toBeCalled();
  });

  it('Displays fallback UI when error occurs', async () => {
    ChildComponentMock.mockImplementation(() => {
      throw new Error();
    });
    await setup();

    expect(screen.getByTestId(FALLBACK_TEST_ID)).toBeInTheDocument();
  });

  it('Reset error state', async () => {
    ChildComponentMock.mockImplementation(() => {
      throw new Error();
    });
    await setupRenderProps();

    const fallbackEl = screen.getByTestId(FALLBACK_TEST_ID);

    ChildComponentMock.mockReset();

    await act(async () => userEvent.click(fallbackEl));
    const child = screen.getByTestId(CHILD_TEST_ID);

    expect(child).toBeInTheDocument();
  });
});
