import { act, screen } from '@testing-library/react';
import { render } from '~test-utils/testing-react';
import { ErrorButton } from './ErrorButton';
import ErrorBoundary from '~components/ErrorBoundary';
import { describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { mockConsole } from '~test-utils/mockConsole';

const setup = async (onError: () => void) => {
  await act(async () =>
    render(
      <ErrorBoundary onError={onError} fallback={null}>
        <ErrorButton />
      </ErrorBoundary>
    )
  );
};

describe('ErrorButton', {}, () => {
  it('Should render normally', async () => {
    const onError = vi.fn();
    await setup(onError);

    expect(onError).not.toBeCalled();
  });

  it('Should throw on click', async () => {
    mockConsole('error');
    const onError = vi.fn();
    await setup(onError);

    const button = screen.getByText('Strange Button');
    await userEvent.click(button);

    expect(onError).toBeCalled();
  });
});
