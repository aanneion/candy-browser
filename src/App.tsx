import React from 'react';
import { BrowserProvider } from './context/BrowserContext';
import { BrowserShell } from './components/BrowserShell';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary>
      <BrowserProvider>
        <BrowserShell />
      </BrowserProvider>
    </ErrorBoundary>
  );
}

export default App;
