import { Action } from 'redux';

export enum StatusActionTypes {
    FETCH_QUEUES = 'FETCH_QUEUES',
    FETCH_ROOMS = 'FETCH_ROOMS',
}

export type ActionStatus = null | 'started' | 'finished' | 'errored';

export type StatusActionPayload = {
    status: ActionStatus,
    error?: {},
};

interface StatusAction extends Action {
    type: string;
    payload: StatusActionPayload;
}

/*
// Type defined as enum vs string literal:
// Enums:
dispatch(setActionStatus(StatusActionTypes.FETCH_QUEUES, 'started')); // VALID
dispatch(setActionStatus('FETCH_QUEUES', 'started')); // VALID
dispatch(setActionStatus('invalid', 'started')); // ERROR
dispatch(setActionStatus(1, 'started')); // ERROR

// String literals:
dispatch(setActionStatus(StatusActionTypes.FETCH_QUEUES, 'started')); // VALID
dispatch(setActionStatus('FETCH_QUEUES', 'started')); // ERROR
dispatch(setActionStatus('invalid', 'started')); // ERROR
dispatch(setActionStatus(1, 'started')); // ERROR

Make whatever you want out of it, but if you ever need to pass in string literal type,
you should change the types in the interfaces.
*/
export interface FetchQueuesStatus extends StatusAction {
    // type: 'FETCH_QUEUES';
    type: StatusActionTypes.FETCH_QUEUES;
}
export interface FetchRoomsStatus extends StatusAction {
    // type: 'FETCH_ROOMS';
    type: StatusActionTypes.FETCH_ROOMS;
}

export type StatusActions = FetchQueuesStatus | FetchRoomsStatus;

export const setActionStatus = (
    actionType: StatusActions['type'],
    status: ActionStatus,
    error?: {},
): StatusActions => {
    const payload: StatusActionPayload = { status };

    if (error) {
        payload.error = error;
    }

    /* tslint:disable:max-line-length */
    /*
    Ignoring this error:
    Type error: Type '{ payload: { status: ActionStatus; }; type: StatusActionTypes; }' is not assignable to type 'StatusActions'.
    Type '{ payload: { status: ActionStatus; }; type: StatusActionTypes; }' is not assignable to type 'FetchRoomsStatus'.
    Types of property 'type' are incompatible.
    Type 'StatusActionTypes' is not assignable to type 'StatusActionTypes.FETCH_ROOMS'.  TS2322
    */
    /* tslint:enable:max-line-length */
    // @ts-ignore
    return {
        payload,
        type: actionType,
    };
};
