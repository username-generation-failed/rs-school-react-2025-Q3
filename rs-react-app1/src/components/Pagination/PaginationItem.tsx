import clsx from 'clsx';

type Props = {
  page: number;
  active: boolean;
};

export const PaginationItem = (props: Props) => {
  const { page, active } = props;

  return (
    <div
      className={clsx(
        'px-4 py-2 text-sm font-semibold text-gray-900 ring-1 ring-gray-300 ring-inset hover:ring-2 dark:bg-gray-900 dark:text-white dark:ring-gray-600 dark:hover:ring-blue-700',
        active && 'bg-blue-700! ring-0! dark:bg-blue-700!'
      )}
    >
      {page}
    </div>
  );
};
