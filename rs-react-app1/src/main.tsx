import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './features/App';
import { assert } from '~utils';

const root = document.getElementById('root');

assert(
  root !== null,
  'failed to call React.createRoot(root), root is undefined'
);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
