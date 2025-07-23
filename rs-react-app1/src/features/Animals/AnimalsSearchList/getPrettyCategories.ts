import type { KeysArray } from '~utils/Object/types';
import type { Animal } from '../types';

const categoryKeys: KeysArray<Animal> = [
  'earthAnimal',
  'earthInsect',
  'feline',
  'avian',
  'canine',
];

const prettyCategoryTable: Record<string, string | undefined> = {
  earthAnimal: 'earth animal',
  earthInsect: 'earth insect',
};

export const getPrettyCategories = (animal: Animal) => {
  return categoryKeys
    .filter((c) => animal[c])
    .map((c) => prettyCategoryTable[c] ?? c);
};
