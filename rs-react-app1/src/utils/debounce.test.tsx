import { describe, expect, it, vi } from 'vitest';
import { debounce } from './debounce';

describe('debounce', {}, async () => {
  it("Don't call immediately", async () => {
    const mockFn = vi.fn();
    const withDebounce = debounce(100, mockFn);

    withDebounce();

    expect(mockFn).not.toBeCalled();
  });

  it('Call after timeout', async () => {
    const mockFn = vi.fn();
    const withDebounce = debounce(100, mockFn);

    withDebounce();

    await new Promise((res) => setTimeout(res, 100));

    expect(mockFn).toBeCalledTimes(1);
  });

  it('Delays execution if called before timeout', async () => {
    let endedAt: number | undefined;
    const mockFn = vi.fn(() => {
      endedAt = performance.now();
    });
    const startedAt = performance.now();
    const withDebounce = debounce(100, mockFn);

    setTimeout(withDebounce, 50);
    await new Promise((res) => setTimeout(res, 200));
    expect(endedAt).not.toBe(undefined);

    expect((endedAt ?? 0) - startedAt).toBeGreaterThanOrEqual(150);
  });
});
