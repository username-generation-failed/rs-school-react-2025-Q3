import { type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';

import { RenderWrapper } from './RenderWrapper';

const customRender = (
  ui: ReactNode,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: RenderWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
