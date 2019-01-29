import thunk, { ThunkMiddleware } from 'redux-thunk';

import { createStore, applyMiddleware, compose } from 'redux';
import { root, RootState } from './reducers/root';

import { Actions } from './actions/types';

export let store = createStore(
    root,
    compose(
        applyMiddleware(
           thunk as ThunkMiddleware<RootState, Actions>, // TODO: figure out why removing this type breaks shit
        ),
        (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__(),
    ),
);
