import { StatusActionPayload, StatusAction, StatusActionTypes } from '../actions/status-actions';
import { RootState } from './root-reducer';

export type StatusState = {
    readonly [K in StatusActionTypes]?: StatusActionPayload;
};

const initialState: StatusState = {};

export const statusReducer = (
    state = initialState,
    action: StatusAction,
): StatusState => {
    if (StatusActionTypes[action.type]) {
        return {
            ...state,
            [action.type]: action.payload,
        };
    }

    return state;
};

export const getActionStatus = (state: RootState, actionType: StatusActionTypes): StatusActionPayload => {
    return state.status[actionType] || { status: null };
};

export const inProgress = (state: RootState, actionType: StatusActionTypes) => {
    const action: StatusActionPayload | undefined = state.status[actionType];

    if (!action) {
        return false;
    }

    return action.status === 'started';
};
