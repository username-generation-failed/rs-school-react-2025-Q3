import React, { type ComponentType } from 'react';
import {
  WithOptimisticShallowCachePersistor,
  type ICachedPersistor,
  type IPersistor,
} from '~lib/Persistor';
import type { Expand, Values } from '~utils/types';
import { persistGateCountingSync } from './PersistGate';
import { WaitHandle, type IWaitHandle } from '~lib/Concurrency/WaitHandle';

type Setter<T extends unknown[]> = (...params: T) => void;

type InferProps<O, DK extends keyof O, SK extends keyof O> = Expand<
  Omit<O, DK | SK> & Partial<Pick<O, SK>>
>;
type InferData<T, K extends keyof T> = Expand<Pick<T, K>>;

type InferMapSetters<O, K extends keyof O, DK extends keyof O> = {
  // have to write wierd shit like "extends Setter<infer R>" this becase any is forbidden, bruh
  // Setter should have been (...params: any[]) => void;
  // and then it could have been written as "extends Setter"
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  [I in K]: O[I] extends Setter<infer R>
    ? (data: InferData<O, DK>, props: Readonly<InferProps<O, DK, K>>) => O[I]
    : never;
};

let persistSchedulledHandle: IWaitHandle | undefined = undefined;

export const withPersist = <
  P extends object,
  IK extends keyof P,
  SK extends keyof P,
>(
  Component: ComponentType<P>,
  defaultData: InferData<P, IK>,
  mapSetters: InferMapSetters<P, SK, IK>,
  _persistor: IPersistor<InferData<P, IK>>
): ComponentType<InferProps<P, IK, SK>> => {
  type Data = InferData<P, IK>;
  type Props = InferProps<P, IK, SK>;
  type MappedSetters = InferMapSetters<P, SK, IK>;
  type Setters = {
    [K in keyof MappedSetters]: ReturnType<MappedSetters[K]>;
  };
  type SetterParameters = Parameters<Values<Setters>>;

  type State = object;

  const persistor: ICachedPersistor<Data> =
    new WithOptimisticShallowCachePersistor(_persistor);

  const PERSIST_STATUS_FALGS = {
    IDLE: 0,
    RESTORED: 1,
    UNMOUNTED: 4,
  } as const;

  class WithPersistWrap extends React.PureComponent<Props, State> {
    data: Data;
    setters: Setters;
    timeerId: number | undefined;

    status: number;
    constructor(props: Props) {
      super(props);
      this.data = { ...defaultData };
      this.setters = {} as Setters;
      this.state = {
        dataWasRestored: false,
      };
      this.assignSetters();

      this.timeerId = undefined;
      this.status = PERSIST_STATUS_FALGS.IDLE;
    }

    assignSetters() {
      Object.keys(mapSetters).forEach((key) => {
        const handleSetter = (...params: SetterParameters) => {
          const f = mapSetters[key as SK](this.data, this.props);
          f(...params);
          persistor.invalidate();

          const parentCb = this.props?.[key as SK] as
            | Setter<SetterParameters>
            | undefined;
          parentCb?.(...params);

          if (this.status & PERSIST_STATUS_FALGS.UNMOUNTED) {
            if (this.timeerId === undefined) {
              this.persistLater();
            }
          }
        };

        this.setters[key as keyof Setters] = handleSetter as Values<Setters>;
      });
    }

    private async persist() {
      await persistor.persist(this.data);
    }

    persistLater() {
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

    onBeforeUnload = () => {
      this.persist();
    };

    async componentDidMount(): Promise<void> {
      window.addEventListener('beforeunload', this.onBeforeUnload);
      persistGateCountingSync.increment();

      if (persistSchedulledHandle !== undefined) {
        await persistSchedulledHandle.wait();
      }
      const data = await persistor.restore();

      if (data !== undefined) {
        this.data = data;
      }

      this.forceUpdate(() => {
        this.status |= PERSIST_STATUS_FALGS.RESTORED;
        persistGateCountingSync.decrement();
      });
    }

    componentWillUnmount(): void {
      window.removeEventListener('beforeunload', this.onBeforeUnload);
      if (!(this.status & PERSIST_STATUS_FALGS.RESTORED)) {
        return;
      }

      // componentWillUnmount triggers before its children's one does
      // in case there're any setters there
      // persist is postponed
      this.persistLater();
      this.status |= PERSIST_STATUS_FALGS.UNMOUNTED;
    }

    render(): React.ReactNode {
      const C = Component as unknown as React.ComponentType<
        Readonly<Props> & Data & Setters
      >;

      return <C {...this.props} {...this.data} {...this.setters} />;
    }
  }

  return WithPersistWrap;
};

//#########################################################
// usage example
//#########################################################
// declare const Component: React.ComponentType<{
//   foo: number;
//   fooDynamic: number;
//   bar: string;
//   onSomething: (value: number) => void;
//   onSomethingElse: () => string;
// }>;
// declare const persistor: IPersistor<{ foo: number }>;
// const A = withPersist(
//   Component,
//   { foo: 1 },
//   {
//     onSomething: (data, props) => (value) =>
//       (data.foo = value + props.fooDynamic),
//   },
//   persistor
// );
// const a = <A bar={'bar'} fooDynamic={1} onSomethingElse={() => '123'} />;
// const b = (
//   <A
//     bar={'bar'}
//     fooDynamic={1}
//     onSomethingElse={() => '123'}
//     onSomething={(value) => {
//       console.log(value);
//     }}
//   />
// );
