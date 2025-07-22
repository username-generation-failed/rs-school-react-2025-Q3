import type { KeysArray } from '~utils/Object/types';
import type { Animal } from '../types';

type Props = {
  item: Animal;
};

const k: KeysArray<Animal> = [
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

const getPrettyCategories = (animal: Animal) => {
  return k.filter((c) => animal[c]).map((c) => prettyCategoryTable[c] ?? c);
};
export const AnimalListItem = (props: Props) => {
  const { item } = props;

  const prettyCategories = getPrettyCategories(item).join(', ');

  return (
    <tr
      key={item.uid}
      className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <td
        scope="row"
        className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white"
      >
        {item.name}
      </td>
      <td className="px-6 py-4">{prettyCategories}</td>
    </tr>
  );
};
