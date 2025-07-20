import clsx from 'clsx';
import Button from '~components/Button';

type Props = React.InputHTMLAttributes<HTMLInputElement>;

export const SearchView = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <div className={clsx('relative', className)}>
      <input
        // autofill breaks styling at least in chrium
        // it applies input:-internal-autofill-selected
        // and it doesn't seem to be a consistent and effective way of disabling it
        // probably the only way is to implement custom autocomplete menu
        // which I'm not doing, lol
        autoComplete="off"
        type="search"
        className={
          'block w-full rounded-lg bg-gray-50 p-4 ps-10 text-sm text-gray-900 ring-1 ring-gray-300 outline-0 ring-inset focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:ring-gray-600'
        }
        {...rest}
      />
      <Button
        type="submit"
        className="absolute end-2.5 top-[50%] translate-y-[-50%] transform"
      >
        Search
      </Button>
    </div>
  );
};
