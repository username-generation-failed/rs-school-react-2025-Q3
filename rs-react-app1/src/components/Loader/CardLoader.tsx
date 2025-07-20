import clsx from 'clsx';
import { Loader } from './Loader';

type Props = {
  loaderWidthP: number;
  className?: string;
  sticky?: boolean;
};

export const CardLoader = (props: Props) => {
  const { loaderWidthP, className, sticky = false } = props;

  return (
    <div
      className={clsx(
        'absolute h-full w-full bg-gray-600 opacity-75 dark:bg-gray-950',
        className
      )}
    >
      <div
        className={clsx(
          'top-[50%] mb-[-15%] flex w-full translate-y-[-50%] justify-center',
          sticky ? 'sticky' : 'absolute'
        )}
        style={{ marginBottom: `${-loaderWidthP / 2}%` }}
      >
        <Loader
          style={{
            width: `${loaderWidthP}%`,
          }}
        />
      </div>
    </div>
  );
};
