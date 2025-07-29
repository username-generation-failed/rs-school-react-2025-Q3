import { Link } from '~components/Link';
import type { Animal, SearchParams } from '../types';
import { getPrettyCategories } from './getPrettyCategories';
import { useSearchParams } from '~hooks/useSearchParams';
import clsx from 'clsx';

type Props = {
  item: Animal;
};

export const AnimalListItem = (props: Props) => {
  const { item } = props;

  const prettyCategories = getPrettyCategories(item).join(', ');
  const [{ details }] = useSearchParams<SearchParams>();

  const active = details === item.uid;
  return (
    <Link
      query={{
        details: item.uid,
      }}
      key={item.uid}
      className={clsx(
        'table-row border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800',
        active && 'invert'
      )}
    >
      <div className="table-cell px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
        {item.name}
      </div>
      <div className="table-cell px-6 py-4">{prettyCategories}</div>
    </Link>
  );
};
