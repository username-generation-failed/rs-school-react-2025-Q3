import { BrowserRouter } from 'react-router';
import { PersistGate } from '~components/Persist';

export const RenderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <PersistGate>
      <BrowserRouter>{children}</BrowserRouter>
    </PersistGate>
  );
};
