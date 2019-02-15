import { ThunkAction, ThunkDispatch as ReduxThunkDispatch } from 'redux-thunk';
import { RootState } from './reducers/root';
import { Actions } from './actions/types';

declare global {
    type ThunkResult<R> = ThunkAction<R, RootState, undefined, Actions>;
    type ThunkDispatch = ReduxThunkDispatch<RootState, undefined, Actions>;
}
