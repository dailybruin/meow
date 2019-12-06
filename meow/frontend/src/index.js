import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Router } from "react-router-dom";

import history from "./history";
import { store, persistor } from "./store";

import "./index.css";
import App from "./components/App";

// try {
//   Notification.requestPermission().then(permission => {
//     if (permission === "denied") {
//       // eslint-disable-next-line no-alert
//       alert("Notifications have been disabled");
//     }
//   });
// } catch (error) {
//   // Safari doesn't return a promise for requestPermissions and it
//   // throws a TypeError. It takes a callback as the first argument
//   // instead.
//   console.log("This browser does not support Notifications");
// }

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
