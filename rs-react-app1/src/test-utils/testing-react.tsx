/* eslint-disable react-refresh/only-export-components */
// react-refresh doesn't matter in test env

import React, { type ReactNode } from 'react';
import { render, type RenderOptions } from '@testing-library/react';

import { PersistGate } from '~components/Persist';

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <PersistGate>{children}</PersistGate>;
};

const customRender = (
  ui: ReactNode,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

export * from '@testing-library/react';
export { customRender as render };
