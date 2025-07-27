import type { Expand } from '~utils/types';

type InferWrapperProps<
  WrappedProps extends object,
  InjectedKeys extends keyof WrappedProps,
> = Expand<Omit<WrappedProps, InjectedKeys>>;

export const injectProps = <
  WrappedProps extends object,
  InjectedKeys extends keyof WrappedProps,
>(
  Component: React.ComponentType<WrappedProps>,
  injectedProps: Pick<WrappedProps, InjectedKeys>
): React.ComponentType<InferWrapperProps<WrappedProps, InjectedKeys>> => {
  type Props = InferWrapperProps<WrappedProps, InjectedKeys>;
  type InjectedProps = Pick<WrappedProps, InjectedKeys>;
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
