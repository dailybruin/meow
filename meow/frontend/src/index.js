import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import createHistory from 'history/createBrowserHistory';
import App from './components/App';
import 'react-table/react-table.css';

import configureStore from './store';

const initialState = {
  auth: {
    token: null,
    isAuthenticated: null,
    isLoading: null,
    user: null,
    errors: {}
  }
};

const history = createHistory();

const { store, persistor } = configureStore(initialState, history);

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </PersistGate>
  </Provider>,
  document.getElementById('app')
);
