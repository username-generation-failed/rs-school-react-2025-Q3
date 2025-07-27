import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from 'react';
import {
  WithOptimisticShallowCachePersistor,
  type ICachedPersistor,
  type IPersistor,
} from '~lib/Persistor';
import type { Expand, Values } from '~utils/types';
import { persistGateCountingSync } from './PersistGate';
import { WaitHandle, type IWaitHandle } from '~lib/Concurrency/WaitHandle';
import Handlers from '~hooks/Handlers';
import { createUseHandlers } from '~hooks/Handlers/Handlers';

const useForceUpdate = () => {
  const count = useRef(0);
  const [state, setState] = useState(0);
  const cbRef = useRef<() => void>(undefined);
  const forceUpdate = useCallback((cb?: () => void) => {
    cbRef.current = cb;
    count.current++;
    setState(count.current);
  }, []);
  useEffect(() => {
    if (count.current === 0) return;
    for (let i = 0; i < count.current; i++) {
      cbRef.current?.();
    }
    count.current = 0;
  }, [state]);

  return forceUpdate;
};

type Setter<T extends unknown[]> = (...params: T) => void;

type InferWrapperProps<
  WrappedProps,
  DataKeys extends keyof WrappedProps,
  SettersKeys extends keyof WrappedProps,
> = Expand<
  Omit<WrappedProps, DataKeys | SettersKeys> &
    Partial<Pick<WrappedProps, SettersKeys>>
>;
type InferData<WrappedProps, K extends keyof WrappedProps> = Expand<
  Pick<WrappedProps, K>
>;

type InferMapSetters<
  WrappedProps,
  SetterKeys extends keyof WrappedProps,
  DataKeys extends keyof WrappedProps,
> = {
  [I in SetterKeys]: WrappedProps[I] extends Setter<infer R> | undefined
    ? (
        data: InferData<WrappedProps, DataKeys>,
        props: Readonly<InferWrapperProps<WrappedProps, DataKeys, SetterKeys>>
      ) => Setter<R>
    : never;
};

let persistSchedulledHandle: IWaitHandle | undefined = undefined;

export const withPersist = <
  WrappedProps extends object,
  DataKeys extends keyof WrappedProps,
  SettersKeys extends keyof WrappedProps,
>(
  Component: ComponentType<WrappedProps>,
  defaultData: InferData<WrappedProps, DataKeys>,
  mapSetters: InferMapSetters<WrappedProps, SettersKeys, DataKeys>,
  _persistor: IPersistor<InferData<WrappedProps, DataKeys>>
): ComponentType<InferWrapperProps<WrappedProps, DataKeys, SettersKeys>> => {
  type Data = InferData<WrappedProps, DataKeys>;
  type Props = InferWrapperProps<WrappedProps, DataKeys, SettersKeys>;
  type MappedSetters = InferMapSetters<WrappedProps, SettersKeys, DataKeys>;
  type Setters = {
    [K in keyof MappedSetters]: ReturnType<MappedSetters[K]>;
  };
  type SetterParameters = Parameters<Values<Setters>>;

  const persistor: ICachedPersistor<Data> =
    new WithOptimisticShallowCachePersistor(_persistor);

  const PERSIST_STATUS_FALGS = {
    IDLE: 0,
    RESTORED: 1,
    UNMOUNTED: 4,
  } as const;

  class WithPersistHandlers extends Handlers<
    Props,
    object,
    {
      forceUpdate: (cb?: () => void) => void;
    }
  > {
    data: Data;
    setters: Setters;
    timeerId: number | undefined;
    status: number;
    constructor() {
      super();
      this.data = { ...defaultData };
      this.setters = {} as Setters;
      this.timeerId = undefined;
      this.status = PERSIST_STATUS_FALGS.IDLE;
      this.assignSetters();
    }

    private assignSetters() {
      const { status, timeerId, setters } = this;
      Object.keys(mapSetters).forEach((key) => {
        const handleSetter = (...params: SetterParameters) => {
          const f = mapSetters[key as SettersKeys](this.data, this.props);
          f(...params);
          persistor.invalidate();

          const parentCb = this.props?.[key as SettersKeys] as
            | Setter<SetterParameters>
            | undefined;
          parentCb?.(...params);

          if (status & PERSIST_STATUS_FALGS.UNMOUNTED) {
            if (timeerId === undefined) {
              this.persistLater();
            }
          }
        };

        setters[key as keyof Setters] = handleSetter as Values<Setters>;
      });
      return setters;
    }

    private async persist() {
      await persistor.persist(this.data);
    }

    private onBeforeUnload = () => {
      this.persist();
    };

    private persistLater() {
      persistSchedulledHandle = persistSchedulledHandle ?? new WaitHandle();
      this.timeerId = setTimeout(async () => {
        this.timeerId = undefined;
        try {
          await this.persist();
        } finally {
          persistSchedulledHandle?.notifyAll();
        }
      });
    }

    onMount = async () => {
      window.addEventListener('beforeunload', this.onBeforeUnload);
      persistGateCountingSync.increment();

      if (persistSchedulledHandle !== undefined) {
        await persistSchedulledHandle.wait();
      }
      const data = await persistor.restore();

      if (data !== undefined) {
        this.data = data;
      }

      this.scope.forceUpdate(() => {
        this.status |= PERSIST_STATUS_FALGS.RESTORED;
        persistGateCountingSync.decrement();
      });
    };

    onUnmount = () => {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
      if (!(this.status & PERSIST_STATUS_FALGS.RESTORED)) {
        return;
      }

      // componentWillUnmount triggers before its children's one does
      // in case there're any setters there
      // persist is postponed
      this.persistLater();
      this.status |= PERSIST_STATUS_FALGS.UNMOUNTED;
    };
  }

  const useWithPersistHandlers = createUseHandlers(
    () => new WithPersistHandlers()
  );

  const WithPersistWrap = (props: Props) => {
    const forceUpdate = useForceUpdate();

    const handlers = useWithPersistHandlers(props, { forceUpdate });

    useEffect(() => {
      handlers.onMount();
      return handlers.onUnmount;
    }, [handlers]);

    const C = Component as unknown as React.ComponentType<
      Readonly<Props> & Data & Setters
    >;

    return <C {...props} {...handlers.data} {...handlers.setters} />;
  };

  return WithPersistWrap;
};
