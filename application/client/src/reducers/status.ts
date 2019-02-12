import { StatusActionPayload, StatusActionTypes } from '../actions/status';
import { RootState } from './root';

export type StatusState = {
    [K in StatusActionTypes]?: StatusActionPayload;
};

const initialState: StatusState = {};

export const status = (
    state = initialState,
    action: any,
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
