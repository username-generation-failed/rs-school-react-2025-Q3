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
    <div className="table-header-group bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
      <div className="table-row">
        <div className="table-cell px-6 py-3">name</div>
        <div className="table-cell px-6 py-3">Categories</div>
      </div>
    </div>
  );

  const tbody = (
    <div className="table-row-group">
      {items.map((item) => (
        <AnimalListItem key={item.uid} item={item} />
      ))}
    </div>
  );

  return (
    <div
      className={clsx(
        'table w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400',
        className
      )}
      {...(rest as ReactHTMLProps<HTMLTableElement>)}
    >
      {thead}
      {tbody}
    </div>
  );
};
