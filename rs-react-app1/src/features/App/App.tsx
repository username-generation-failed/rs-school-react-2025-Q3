import { PersistGate } from '~components/Persist';
import AnimalsSearchList from '../Animals/AnimalsSearchList';
import { AppErrorBoundary } from './AppErrorBoundary';
import { ErrorButton } from './ErrorButton';
import Page from '~components/Page';

export function App() {
  return (
    <AppErrorBoundary>
      <PersistGate>
        <Page>
          <AnimalsSearchList />
          <ErrorButton />
        </Page>
      </PersistGate>
    </AppErrorBoundary>
  );
}
