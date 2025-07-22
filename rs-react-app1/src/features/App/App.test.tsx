import { act, render } from '@testing-library/react';

import { describe, it } from 'vitest';

import { App } from './App';

const setup = async () => {
  await act(async () => render(<App />));
};

describe('App', {}, () => {
  it('Should render normally', async () => {
    await setup();
  });
});
