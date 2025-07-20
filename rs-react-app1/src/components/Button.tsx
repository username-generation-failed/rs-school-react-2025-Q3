import clsx from 'clsx';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = (props: Props) => {
  const { className, ...rest } = props;
  return (
    <button
      className={clsx(
        'rounded-lg bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 active:ring-4 active:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:active:ring-blue-800',
        className
      )}
      {...rest}
    />
  );
};

export default Button;
