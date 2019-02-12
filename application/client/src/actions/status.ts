import { Action } from 'redux';
import { ServerException } from './types';

export enum StatusActionTypes {
    FETCH_QUEUES = 'FETCH_QUEUES',
    FETCH_ROOMS = 'FETCH_ROOMS',
    CREATE_QUEUE = 'CREATE_QUEUE',
    REMOVE_QUEUE = 'REMOVE_QUEUE',
}

export type ActionStatus = null | 'started' | 'finished' | 'failed';

export type StatusActionPayload = {
    status: ActionStatus,
    // Note: this is implicit and not type-checked due to limitations of the type system, as well as the fact this
    // module goes for as much universal character as possible with minimum code and definitions. To achieve what we
    // need, there would have to be a function per action type (and status), which is suboptimal since it would quickly
    // become a very bloated file. Considering the fact this is supposed to be utilised scarcely, this will have to do
    // for now. Just write tests.
    additional?: {},
    error?: ServerException | string,
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
export interface CreateQueueStatus extends StatusAction {
    // type: 'FETCH_ROOMS';
    type: StatusActionTypes.CREATE_QUEUE;
}
export interface RemoveQueueStatus extends StatusAction {
    // type: 'REMOVE_QUEUE';
    type: StatusActionTypes.REMOVE_QUEUE;
}

export type StatusActions = FetchQueuesStatus | FetchRoomsStatus | CreateQueueStatus | RemoveQueueStatus;

/* tslint:disable */
// export const setActionStatus = (
//     actionType: StatusActions['type'],
//     status: ActionStatus,
//     error?: ServerException | string,
// ): StatusActions => {
//     const payload: StatusActionPayload = { status };
//
//     if (error) {
//         payload.error = error;
//     }
//
//     /* tslint:disable:max-line-length */
//     /*
//     Ignoring this error:
//     Type error: Type '{ payload: { status: ActionStatus; }; type: StatusActionTypes; }' is not assignable to type 'StatusActions'.
//     Type '{ payload: { status: ActionStatus; }; type: StatusActionTypes; }' is not assignable to type 'FetchRoomsStatus'.
//     Types of property 'type' are incompatible.
//     Type 'StatusActionTypes' is not assignable to type 'StatusActionTypes.FETCH_ROOMS'.  TS2322
//     */
//     /* tslint:enable:max-line-length */
//     // @ts-ignore
//     return {
//         payload,
//         type: actionType,
//     };
// };
/* tslint:enable */

export const actionStarted = (
    actionType: StatusActions['type'],
    additional?: {},
): StatusActions => {
    const payload: StatusActionPayload = {
        additional,
        status: 'started',
    };

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

export const actionFinished = (
    actionType: StatusActions['type'],
): StatusActions => {
    const payload: StatusActionPayload = { status: 'finished' };

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

export const actionFailed = (
    actionType: StatusActions['type'],
    error?: ServerException | string,
): StatusActions => {
    const payload: StatusActionPayload = { status: 'failed' };

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
