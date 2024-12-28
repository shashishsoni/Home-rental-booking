import { StrictMode } from 'react';
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, getPersistor } from "./redux/storecache";
import LoadingWrapper from './components/common/LoadingWrapper';
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <LoadingWrapper>
      <Provider store={store}>
        <PersistGate loading={null} persistor={getPersistor()}>
          <App />
        </PersistGate>
      </Provider>
    </LoadingWrapper>
  </StrictMode>
);

