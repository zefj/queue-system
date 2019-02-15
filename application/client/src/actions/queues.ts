import { getClient } from '../api/client';
import { IQueueWithStats } from './types';
import { StatusActionTypes, withStatus } from './status';
import { Action } from 'redux';

export enum QueuesActionTypes {
    SET_QUEUES = 'SET_QUEUES',
}

export type QueuesActions = ISetQueuesAction;

export interface ISetQueuesAction extends Action {
    type: QueuesActionTypes.SET_QUEUES;
    payload: {
        queues: IQueueWithStats[],
    };
}

export const setQueues = (
    queues: IQueueWithStats[],
): ISetQueuesAction => {
    return {
        type: QueuesActionTypes.SET_QUEUES,
        payload: {
            queues,
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
    queue: IQueueWithStats,
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
