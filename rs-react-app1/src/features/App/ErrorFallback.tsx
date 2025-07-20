import type { ReactNode } from 'react';
import React from 'react';
import Button from '~components/Button';
import Page from '~components/Page';
import { withPersist } from '~components/Persist';
import { LocalStoragePersistor } from '~lib/Persistor';

type ViewProps = {
  reset: () => void;
};

const ErrorFallback1 = (props: ViewProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <p>Ooops, Unexpected Error has occured ( ͡° ͜ʖ ͡°)</p>
      <p>Happened to click any strange buttons, perhaps?</p>
      <Button className="absolute end-2.5 bottom-2.5" onClick={props.reset}>
        Reset
      </Button>
    </div>
  );
};

const ErrorFallback2 = (props: ViewProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <p>No no no, Mr Error, you won&apos;t go to your page</p>
      <p>You will go to this ebanyi console</p>
      <Button className="absolute end-2.5 bottom-2.5" onClick={props.reset}>
        Reset
      </Button>
    </div>
  );
};

const ErrorFallback3 = (props: ViewProps) => {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center">
      <img src="/filename" />
      <Button className="absolute end-2.5 bottom-2.5" onClick={props.reset}>
        Reset
      </Button>
    </div>
  );
};

const ErrorFallbacks = [ErrorFallback1, ErrorFallback2, ErrorFallback3];

type Props = ViewProps & {
  i: number;
  setI: (value: number) => void;
};

export class ErrorFallback extends React.Component<Props> {
  componentDidMount(): void {
    this.props.setI((this.props.i + 1) % ErrorFallbacks.length);
  }

  componentWillUnmount(): void {
    const { i } = this.props;
    this.props.setI(i === 0 ? ErrorFallbacks.length - 1 : i - 1);
  }

  render(): ReactNode {
    const { props } = this;
    const Component = ErrorFallbacks[props.i];

    return (
      <Page>
        <div className="text-[max(1em,2vw)]">
          <Component reset={props.reset} />
        </div>
      </Page>
    );
  }
}

const ErrorFallbackPersisted = withPersist(
  ErrorFallback,
  { i: 0 },
  { setI: (data) => (value) => (data.i = value) },
  new LocalStoragePersistor('errorboundaryfallback')
);
export default ErrorFallbackPersisted;
