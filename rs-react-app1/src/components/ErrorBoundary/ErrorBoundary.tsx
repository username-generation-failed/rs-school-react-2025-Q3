import React from 'react';

type RenderFallback = (passProps: { reset: () => void }) => React.ReactNode;
type Props = React.PropsWithChildren<{
  fallback: React.ReactNode | RenderFallback;
  onError?: (error: Error) => void;
}>;

type State = { hasError: boolean };
export class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    const { state, props } = this;

    if (!state.hasError) {
      return props.children;
    }

    if (typeof props.fallback === 'function') {
      return props.fallback({ reset: this.handleReset });
    }

    return props.fallback;
  }
}
