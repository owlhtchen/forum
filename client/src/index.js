import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import reduxThunk from 'redux-thunk';
import axios from 'axios';

import './index.css';
import App from './components/App';
import rootReducer from './reducers/index';

const token = localStorage.getItem('token');
const userID = localStorage.getItem('userID');
axios.defaults.headers.common['authorization'] = token;

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, {
  user: {
    token: token,
    userID: userID, 
    isAuthed: (token != "" && userID != "") ? true: false
  }
}, composeEnhancers(applyMiddleware(reduxThunk)) );

render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'));