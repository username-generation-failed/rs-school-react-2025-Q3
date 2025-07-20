import React, { type PropsWithChildren } from 'react';
import {
  CountingSync,
  type ICountingSync,
} from '~lib/Concurrency/CountingSync';

type Props = PropsWithChildren;
type State = {
  wasRestored: boolean;
};

export const createPersistGate = () => {
  const persistGateCountingSync: ICountingSync = new CountingSync();

  class PersistGate extends React.PureComponent<Props, State> {
    state: State = {
      wasRestored: false,
    };

    async componentDidMount(): Promise<void> {
      await persistGateCountingSync.wait();
      this.setState({ wasRestored: true });
    }

    render(): React.ReactNode {
      const { state, props } = this;

      return (
        <div style={{ visibility: state.wasRestored ? 'visible' : 'hidden' }}>
          {props.children}
        </div>
      );
    }
  }

  return {
    persistGateCountingSync,
    PersistGate,
  };
};

export const { persistGateCountingSync, PersistGate } = createPersistGate();
