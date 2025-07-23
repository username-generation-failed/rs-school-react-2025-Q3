import { vi } from 'vitest';

export const createMockAsyncCommand = () => ({
  exec: vi.fn(),
});
