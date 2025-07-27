import { PersistGate } from '~components/Persist';
import AnimalsSearchList from '../Animals/AnimalsSearchList';
import { AppErrorBoundary } from './AppErrorBoundary';
import Page from '~components/Page';

export function App() {
  return (
    <AppErrorBoundary>
      <PersistGate>
        <Page>
          <AnimalsSearchList />
        </Page>
      </PersistGate>
    </AppErrorBoundary>
  );
}
