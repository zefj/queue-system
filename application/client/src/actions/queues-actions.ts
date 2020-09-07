import { getClient } from '../api/client';
import { IQueueWithRooms } from './types';
import { StatusActionTypes, withStatus } from './status-actions';
import { Action } from 'redux';

export enum QueuesActionTypes {
    SET_QUEUES = 'SET_QUEUES',
    SET_QUEUE = 'SET_QUEUE',
}

export type QueuesActions = ISetQueuesAction | ISetQueueAction;

export interface ISetQueuesAction extends Action {
    type: QueuesActionTypes.SET_QUEUES;
    payload: {
        queues: IQueueWithRooms[],
    };
}

export interface ISetQueueAction extends Action {
    type: QueuesActionTypes.SET_QUEUE;
    payload: {
        queue: IQueueWithRooms,
    };
}

export const setQueues = (
    queues: IQueueWithRooms[],
): ISetQueuesAction => {
    return {
        type: QueuesActionTypes.SET_QUEUES,
        payload: {
            queues,
        },
    };
};

export const setQueue = (
    queue: IQueueWithRooms,
): ISetQueueAction => {
    return {
        type: QueuesActionTypes.SET_QUEUE,
        payload: {
            queue,
        },
    };
};

export const fetchQueues = (): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        const client = await getClient();

        try {
            const response = await dispatch(withStatus(
                StatusActionTypes.FETCH_QUEUES,
                () => client.apis.queues.getQueues(),
            ));

            dispatch(setQueues(response.body.queues));
        } catch (e) {
            dispatch(setQueues([]));
        }
    };
};

export const fetchQueue = (id: number): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        const client = await getClient();

        const response = await dispatch(withStatus(
            StatusActionTypes.FETCH_QUEUE,
            () => client.apis.queues.getQueue({ queue_id: id }),
        ));

        dispatch(setQueue(response.body.queue));
    };
};

export const createQueue = (
    name: string,
): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        const client = await getClient();

        await dispatch(withStatus(
            StatusActionTypes.CREATE_QUEUE,
            () => client.apis.queues.createQueue({}, { requestBody: { name } }),
        ));

        dispatch(fetchQueues());
    };
};

export const removeQueue = (
    queue: IQueueWithRooms,
): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        const client = await getClient();

        await dispatch(withStatus(
            StatusActionTypes.REMOVE_QUEUE,
            () => client.apis.queues.removeQueue({ queue_id: queue.id }),
            { id: queue.id }),
        );

        dispatch(fetchQueues());
    };
};
