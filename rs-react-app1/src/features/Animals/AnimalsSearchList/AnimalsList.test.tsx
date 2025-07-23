import { describe, expect, it, vi } from 'vitest';
import type { Animal } from '../types';
import { act, render, screen } from '~test-utils/testing-react';
import { generateAnimals } from '../test-utils';
import { AnimalsList } from './AnimalsList';

const ANIMALS_LIST_ITEM_TESTID = 'ANIMALS_LIST_ITEM_TESTID';
vi.mock('./AnimalsListItem.tsx', () => ({
  AnimalListItem: () => <div data-testid={ANIMALS_LIST_ITEM_TESTID}></div>,
}));

const setup = async (items: Animal[]) => {
  const utils = await act(async () => render(<AnimalsList items={items} />));

  return {
    utils,
  };
};

describe('AnimalsListItem', {}, () => {
  it('Renders all animals', async () => {
    const animals = generateAnimals(50);

    await setup(animals);

    expect(screen.getAllByTestId(ANIMALS_LIST_ITEM_TESTID).length).toBe(
      animals.length
    );
  });
});
