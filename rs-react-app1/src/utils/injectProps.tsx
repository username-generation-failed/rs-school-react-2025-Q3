import type { Expand } from '~utils/types';

type InferProps<T extends object, K extends keyof T> = Expand<Omit<T, K>>;

export const injectProps = <P extends object, IK extends keyof P>(
  Component: React.ComponentType<P>,
  injectedProps: Pick<P, IK>
): React.ComponentType<InferProps<P, IK>> => {
  type Props = InferProps<P, IK>;
  type InjectedProps = Pick<P, IK>;
  const PropsInjector = (props: Props) => {
    // the culprit for unknown is Expand<> type
    // without it casting not needed
    // but types are prettier this way ¯_(ツ)_/¯
    // ...well most of the times they are, when P is too big it's the oposite
    const C = Component as unknown as React.ComponentType<
      InjectedProps & Props
    >;
    return <C {...props} {...injectedProps} />;
  };

  return PropsInjector;
};
