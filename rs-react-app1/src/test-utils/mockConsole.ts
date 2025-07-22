import { afterAll, vi } from 'vitest';

export const mockConsole = <N extends keyof Console>(name: N) => {
  const prev = console[name];
  console[name] = vi.fn();
  afterAll(() => {
    console[name] = prev;
  });
};
