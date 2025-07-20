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

export const AnimalListItem = (props: Props) => {
  const { item } = props;

  const categories = k.filter((k) => item[k]);
  return (
    <div className="flex divide-x-2 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-[50%] min-w-[50%] overflow-clip border-gray-200 p-4 dark:border-gray-800">
        {item.name}
      </div>
      <div className="flex-1/2 p-4">{categories.join(',')}</div>
    </div>
  );
};
