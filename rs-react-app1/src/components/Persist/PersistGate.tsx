import { useEffect, useState, type PropsWithChildren } from 'react';
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

  const PersistGate = (props: Props) => {
    const [state, setState] = useState<State>({
      wasRestored: false,
    });

    useEffect(() => {
      persistGateCountingSync.wait().then(() => {
        setState({ wasRestored: true });
      });
    }, []);

    return (
      <div style={{ visibility: state.wasRestored ? 'visible' : 'hidden' }}>
        {props.children}
      </div>
    );
  };

  return {
    persistGateCountingSync,
    PersistGate,
  };
};

export const { persistGateCountingSync, PersistGate } = createPersistGate();
