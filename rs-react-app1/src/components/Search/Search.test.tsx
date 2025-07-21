import { expect, describe, it, vi } from 'vitest';
import { act, render, screen } from '~test-utils/testing-react';
import { Search, type Props } from './Search';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

type SetupConfig = {
  onSearch: Props['onSearch'];
};
const defaultConfig = {
  onSearch: () => {},
};
const setup = async (config: SetupConfig = defaultConfig) => {
  const { onSearch } = config;
  const utils = await act(async () => render(<Search onSearch={onSearch} />));
  const input = utils.container.getElementsByTagName('input')[0];
  const button = screen.getByText('Search');

  return {
    input,
    button,
    utils,
  };
};

describe('Search', {}, () => {
  it('Renders search input and search button', async () => {
    const { input, button } = await setup();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('Shows empty input when no saved term exists', async () => {
    const { input } = await setup();

    expect(input.value).toBe('');
  });

  it('Updates input value when user types', {}, async () => {
    const { input } = await setup();

    const query = faker.word.noun();

    await userEvent.type(input, query);

    expect(input.value).toBe(query);
  });

  it('Triggers search callback with correct parameters', {}, async () => {
    const onSearch = vi.fn();
    const { input, button } = await setup({ onSearch });

    let query = faker.word.noun();
    await userEvent.type(input, `${query}{Enter}`);

    expect(onSearch).toBeCalledWith(query);
    await userEvent.clear(input);

    query = faker.word.noun();
    await userEvent.type(input, `${query}`);
    await userEvent.click(button);

    expect(onSearch).toBeCalledWith(query);
  });
});
