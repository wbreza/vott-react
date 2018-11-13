import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import reduxImmutableStateInvarient from 'redux-immutable-state-invariant';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

export default class Store {

}

Store.create = (initialState) => {
    return createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunk, reduxImmutableStateInvarient(), createLogger())
    );
}