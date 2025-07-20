import clsx from 'clsx';
import type { Animal } from '../types';
import type { KeysArray } from '~utils/Object/types';
import type { ReactHTMLProps } from '~utils/types';

type Props = {
  items: Animal[];
} & ReactHTMLProps<HTMLElement>;

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

export const AnimalsSearchListView = (props: Props) => {
  const { items, className, ...rest } = props;

  if (items.length === 0) {
    return null;
  }

  const thead = (
    <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">
          name
        </th>
        <th scope="col" className="px-6 py-3">
          Categories
        </th>
      </tr>
    </thead>
  );

  const body = (
    <tbody>
      {items.map((item) => (
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
          <td className="px-6 py-4">{getPrettyCategories(item).join(', ')}</td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <table
      className={clsx(
        'w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400',
        className
      )}
      {...(rest as ReactHTMLProps<HTMLTableElement>)}
    >
      {thead}
      {body}
    </table>
  );
};
