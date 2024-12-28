// src/main.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/storecache';
import App from './App';
import "./index.css";

// Ensure React is properly initialized
window.React = React;

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

const root = createRoot(container);

// Wrap with React.StrictMode to catch potential issues
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
