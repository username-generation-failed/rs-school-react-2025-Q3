import Button from '~components/Button';
import Page from '~components/Page';

type ViewProps = {
  reset: () => void;
};

const ErrorFallback = (props: ViewProps) => {
  return (
    <Page>
      <div className="text-[max(1em,2vw)]">
        <div className="flex h-screen flex-col items-center justify-center text-center">
          <p>Ooops, Unexpected Error has occured ( ͡° ͜ʖ ͡°)</p>
          <Button className="absolute end-2.5 bottom-2.5" onClick={props.reset}>
            Reset
          </Button>
        </div>
      </div>
    </Page>
  );
};

export default ErrorFallback;
