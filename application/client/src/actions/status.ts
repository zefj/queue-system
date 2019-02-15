import * as _ from 'lodash';

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

export interface StatusAction extends Action {
    type: StatusActionTypes;
    payload: StatusActionPayload;
}

export const actionStarted = (
    actionType: StatusAction['type'],
    additional?: {},
): StatusAction => {
    const payload: StatusActionPayload = {
        additional,
        status: 'started',
    };

    /* tslint:disable:max-line-length */
    /*
    Ignoring this error:
    Type error: Type '{ payload: { status: ActionStatus; }; type: StatusActionTypes; }' is not assignable to type 'StatusAction'.
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
    actionType: StatusAction['type'],
): StatusAction => {
    const payload: StatusActionPayload = { status: 'finished' };

    /* tslint:disable:max-line-length */
    /*
    Ignoring this error:
    Type error: Type '{ payload: { status: ActionStatus; }; type: StatusActionTypes; }' is not assignable to type 'StatusAction'.
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
    actionType: StatusAction['type'],
    error?: ServerException | string,
): StatusAction => {
    const payload: StatusActionPayload = { status: 'failed' };

    if (error) {
        payload.error = error;
    }

    /* tslint:disable:max-line-length */
    /*
    Ignoring this error:
    Type error: Type '{ payload: { status: ActionStatus; }; type: StatusActionTypes; }' is not assignable to type 'StatusAction'.
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

export const withStatus = (
    actionType: StatusAction['type'],
    fn: () => Promise<any>,
    startActionData?: {},
): ThunkResult<Promise<any>> => async (dispatch) => {
    try {
        dispatch(actionStarted(
            actionType,
            startActionData,
        ));

        const result = await fn();

        dispatch(actionFinished(actionType));

        return result;
    } catch (err) {
        dispatch(actionFailed(actionType, _.get(err, 'response.body', null) || err.message));

        return Promise.reject(err);
    }
};
