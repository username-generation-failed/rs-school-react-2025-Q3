import type { Animal } from '../types';
import { getPrettyCategories } from './getPrettyCategories';

type Props = {
  item: Animal;
};

export const AnimalListItem = (props: Props) => {
  const { item } = props;

  const prettyCategories = getPrettyCategories(item).join(', ');

  return (
    <div
      key={item.uid}
      className="table-row border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
    >
      <div className="table-cell px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
        {item.name}
      </div>
      <div className="table-cell px-6 py-4">{prettyCategories}</div>
    </div>
  );
};
