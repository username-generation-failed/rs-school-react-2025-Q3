import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { assert } from '~utils';

const root = document.getElementById('root');

assert(root !== null, 'failed to React.createRoot(root), root is undefined');

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
