import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import axios from 'axios';

import './index.css';
import App from './components/App';
import rootReducer from './reducers/index';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, {}, composeEnhancers(applyMiddleware(reduxThunk)) );

const token = localStorage.getItem('token');
axios.defaults.headers.common['authorization'] = token;

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));