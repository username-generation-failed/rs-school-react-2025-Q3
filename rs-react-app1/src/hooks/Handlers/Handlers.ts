import { useMemo, useRef, useState, type SetStateAction } from 'react';

export class Handlers<Props = object, State = object, Scope = object> {
  props!: Readonly<Props>;
  state!: Readonly<State>;
  scope!: Readonly<Scope>;
  setState(state: SetStateAction<State>) {
    if (typeof state === 'function') {
      this.state = (state as (prevstate: State) => State)(this.state);
    } else {
      this.state = { ...this.state, ...state };
    }
  }
}

export const createUseHandlers = <H extends Handlers>(
  createHandlers: () => H
) => {
  type _Props = H['props'];
  type _State = H['state'];
  type _Scope = H['scope'];
  return <
    Props extends _Props = _Props,
    State extends _State = _State,
    Scope extends _Scope = _Scope,
  >(
    props: Props,
    scope: Scope = {} as Scope
  ): H => {
    const handlers = useMemo(createHandlers, []);
    const [state, setState] = useState<State>(handlers.state as State);
    const skipInitialStateSyncRef = useRef(true);

    handlers.setState = setState;
    if (skipInitialStateSyncRef.current) {
      skipInitialStateSyncRef.current = false;
    } else {
      handlers.state = state;
    }

    handlers.props = props;
    handlers.scope = scope;

    return handlers;
  };
};
