import { ThunkAction } from 'redux-thunk';
import { RootState } from './reducers/root';
import { Actions } from './actions/types';

declare global {
    type ThunkResult<R> = ThunkAction<R, RootState, undefined, Actions>;
    type ThunkDispatch = ThunkDispatch<RootState, undefined, Actions>;
}
