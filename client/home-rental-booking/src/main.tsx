import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store } from "./redux/storecache";
import { persistor } from "./redux/storecache";
import App from "./App";
import "./index.css";

// Ensure store is initialized before rendering
if (!store) {
  throw new Error('Redux store failed to initialize');
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
