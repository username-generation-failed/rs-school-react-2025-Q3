import clsx from 'clsx';
import type { Animal } from '../types';
import type { ReactHTMLProps } from '~utils/types';
import { AnimalListItem } from './AnimalsListItem';

type Props = {
  items: Animal[];
} & ReactHTMLProps<HTMLElement>;

export const AnimalsList = (props: Props) => {
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

  const tbody = (
    <tbody>
      {items.map((item) => (
        <AnimalListItem key={item.uid} item={item} />
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
      {tbody}
    </table>
  );
};
