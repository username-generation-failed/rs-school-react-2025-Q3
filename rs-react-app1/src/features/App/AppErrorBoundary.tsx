import ErrorBoundary from '~components/ErrorBoundary';
import { injectProps } from '~utils/react/injectProps';
import ErrorFallback from './ErrorFallback';

export const AppErrorBoundary = injectProps(ErrorBoundary, {
  onError(error) {
    console.error(error);
  },
  fallback: ({ reset }) => <ErrorFallback reset={reset} />,
});
