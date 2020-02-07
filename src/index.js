import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {createStore, compose, applyMiddleware, combineReducers} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import itemsReducer from "./store/reducers/items";
import buildReducer from "./store/reducers/build";
import navReducer from "./store/reducers/nav";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

function configureStore() {
    const rootReducer = combineReducers({
        items: itemsReducer,
        build: buildReducer,
        nav: navReducer,
    });

    const store = createStore(
        rootReducer,
        composeEnhancers(applyMiddleware(thunk))
    );

    return store;
}

const store = configureStore();

const app = (
    <Provider store={store}>
        <App/>
    </Provider>
);


ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
