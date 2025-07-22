import { describe, expect, it } from 'vitest';
import type { Animal } from '../types';
import { AnimalListItem } from './AnimalsListItem';
import { act, render, screen } from '~test-utils/testing-react';
import { generateAnimals } from '../test-utils';
import { getPrettyCategories } from './getPrettyCategories';

const setup = async (item: Animal) => {
  const utils = await act(async () =>
    render(
      <table>
        <tbody>
          <AnimalListItem item={item} />
        </tbody>
      </table>
    )
  );

  return {
    utils,
  };
};

describe('AnimalsListItem', {}, () => {
  it('Renders animal', async () => {
    const animal = generateAnimals(1)[0];

    await setup(animal);

    expect(screen.getByText(animal.name)).toBeInTheDocument();
    getPrettyCategories(animal).forEach((c) => {
      expect(screen.getByText(c, { exact: false })).toBeInTheDocument();
    });
  });
});
