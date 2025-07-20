import type { IAppError } from '~lib/types';

type Props = {
  error: IAppError;
};

export const ErrorMessage = (props: Props) => {
  const { error } = props;

  return (
    <div className="flex grow-1 items-center justify-center">
      <p>
        {error.name}: {error.message}
      </p>
      <p>{error.humanFriendlyMessage}</p>
    </div>
  );
};
