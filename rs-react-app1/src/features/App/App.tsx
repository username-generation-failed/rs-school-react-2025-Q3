import { PersistGate } from '~components/Persist';
import { AppErrorBoundary } from './AppErrorBoundary';
import { Route, Routes } from 'react-router';
import { BrowserRouter } from 'react-router';

import SearchAnimalsPage from '~pages/SearchAnimalsPage';
import Details from '~features/Animals/Details';
import NotFoundPage from '~pages/NotFoundPage';
import AboutPage from '~pages/AboutPage';

export function App() {
  return (
    <AppErrorBoundary>
      <PersistGate>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SearchAnimalsPage />}>
              <Route index element={<Details />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </BrowserRouter>
      </PersistGate>
    </AppErrorBoundary>
  );
}
