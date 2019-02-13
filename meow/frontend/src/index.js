import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Router } from "react-router-dom";

import history from "./history";
import { store, persistor } from "./store";

import "./index.css";
import App from "./components/App";

if (typeof Notification === "function") {
  Notification.requestPermission().then(permission => {
    if (permission === "denied") {
    }
  });
}

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router history={history}>
        <App />
      </Router>
    </PersistGate>
  </Provider>,
  document.getElementById("app")
);
