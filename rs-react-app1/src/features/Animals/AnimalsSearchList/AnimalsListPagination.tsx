import { Link } from '~components/Link';
import { Pagination } from '~components/Pagination';
import type { Props as PaginationProps } from '~components/Pagination/Pagination';
import { PaginationItem } from '~components/Pagination/PaginationItem';

type Props = Pick<PaginationProps, 'activePage' | 'lastPage'>;

export const AnimalsListPagination = (props: Props) => {
  return (
    <div className="sticky bottom-2 flex justify-center">
      <Pagination
        className="rounded-3xl bg-gray-900 px-7 py-2"
        renderItem={(page, activePage) => (
          <Link
            query={{
              page: String(page),
            }}
            key={page}
          >
            <PaginationItem page={page} active={page === activePage} />
          </Link>
        )}
        {...props}
      />
    </div>
  );
};
