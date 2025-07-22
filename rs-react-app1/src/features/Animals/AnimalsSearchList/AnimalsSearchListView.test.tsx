import { describe, expect, it, vi } from 'vitest';
import type { PaginatedResponceDto } from '../types';
import { act, render, screen } from '~test-utils/testing-react';
import { createMockComponent } from '~test-utils/createMockComponent';
import { AnimalsSearchListView, type Props } from './AnimalsSearchListView';
import type { AsyncStatus } from '~lib/types';
import type { AsyncStateByStatus } from '~components/AsyncCommandManager/AsyncCommandManager';
import { generatePaginatedAnimals } from '../test-utils';
import { RequestError } from '~lib/Errors';

const CARD_LOADER_ITEM_TESTID = 'CARD_LOADER_ITEM_TESTID';
vi.mock('../../../components/Loader/CardLoader.tsx', () => ({
  CardLoader: createMockComponent('CARD_LOADER_ITEM_TESTID'),
}));

const ANIMALS_SEARCH_ITEM_TESTID = 'ANIMALS_SEARCH_ITEM_TESTID';
vi.mock('./AnimalsSearch.tsx', () => ({
  default: createMockComponent('ANIMALS_SEARCH_ITEM_TESTID'),
}));

const ANIMALS_LIST_ITEM_TESTID = 'ANIMALS_LIST_ITEM_TESTID';
vi.mock('./AnimalsList.tsx', () => ({
  AnimalsList: createMockComponent('ANIMALS_LIST_ITEM_TESTID'),
}));

const ERROR_MESSAGE_ITEM_TESTID = 'ERROR_MESSAGE_ITEM_TESTID';
vi.mock('../../../components/ErrorMessage.tsx', () => ({
  ErrorMessage: createMockComponent('ERROR_MESSAGE_ITEM_TESTID'),
}));

const setup = async (props: Omit<Props, 'onSearch'>) => {
  const utils = await act(async () =>
    render(<AnimalsSearchListView {...props} onSearch={() => {}} />)
  );

  return {
    utils,
  };
};

type State<S extends AsyncStatus> = AsyncStateByStatus<PaginatedResponceDto, S>;

describe('AnimalsSearchListView', {}, () => {
  it('Renders only search input on idle state', async () => {
    const state: State<'idle'> = {
      status: 'idle',
      error: undefined,
      result: undefined,
    };

    await setup({ state });

    expect(screen.getByTestId(ANIMALS_SEARCH_ITEM_TESTID)).toBeInTheDocument();
    [
      ANIMALS_LIST_ITEM_TESTID,
      CARD_LOADER_ITEM_TESTID,
      ERROR_MESSAGE_ITEM_TESTID,
    ].forEach((id) => {
      expect(screen.queryByTestId(id)).toBe(null);
    });
  });

  it('Renders loader on pending', async () => {
    const state: State<'pending'> = {
      status: 'pending',
      error: undefined,
      result: undefined,
    };

    await setup({ state });

    [CARD_LOADER_ITEM_TESTID, ANIMALS_SEARCH_ITEM_TESTID].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
    [ANIMALS_LIST_ITEM_TESTID, ERROR_MESSAGE_ITEM_TESTID].forEach((id) => {
      expect(screen.queryByTestId(id)).toBe(null);
    });
  });

  it('Renders list on success', async () => {
    const state: State<'success'> = {
      status: 'success',
      error: undefined,
      result: generatePaginatedAnimals(10),
    };

    await setup({ state });

    [ANIMALS_LIST_ITEM_TESTID, ANIMALS_SEARCH_ITEM_TESTID].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
    [CARD_LOADER_ITEM_TESTID, ERROR_MESSAGE_ITEM_TESTID].forEach((id) => {
      expect(screen.queryByTestId(id)).toBe(null);
    });
  });

  it('Renders message on empty result', async () => {
    const state: State<'success'> = {
      status: 'success',
      error: undefined,
      result: generatePaginatedAnimals(0),
    };

    await setup({ state });

    expect(screen.getByTestId(ANIMALS_SEARCH_ITEM_TESTID)).toBeInTheDocument();
    expect(screen.getByText('Nothing Found')).toBeInTheDocument();

    [CARD_LOADER_ITEM_TESTID, ERROR_MESSAGE_ITEM_TESTID].forEach((id) => {
      expect(screen.queryByTestId(id)).toBe(null);
    });
  });

  it('Renders error message on fail', async () => {
    const state: State<'error'> = {
      status: 'error',
      error: new RequestError('mock error'),
      result: undefined,
    };

    await setup({ state });

    [ERROR_MESSAGE_ITEM_TESTID, ANIMALS_SEARCH_ITEM_TESTID].forEach((id) => {
      expect(screen.getByTestId(id)).toBeInTheDocument();
    });
    [CARD_LOADER_ITEM_TESTID, ANIMALS_LIST_ITEM_TESTID].forEach((id) => {
      expect(screen.queryByTestId(id)).toBe(null);
    });
  });
});
