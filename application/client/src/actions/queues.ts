import { getClient } from '../api/client';
import { QueueInterface } from './types';
import {
    actionFailed,
    actionFinished,
    actionStarted,
    StatusActionTypes,
} from './status';
import { Action, ActionCreator } from 'redux';

export enum QueuesActionTypes {
    SET_QUEUES = 'SET_QUEUES',
    FLUSH_QUEUES = 'FLUSH_QUEUES',
}

export type QueuesActions = SetQueuesActionInterface | FlushQueuesActionInterface;

export const fetchQueues = (): ThunkResult<Promise<void>> => {
    return (dispatch) => {
        return getClient()
            .then((client: any) => {
                dispatch(actionStarted(StatusActionTypes.FETCH_QUEUES));

                return client.apis.queues.getQueues()
                    .then((response: any) => dispatch(setQueues(response.body.queues)))
                    .then(() => dispatch(actionFinished(StatusActionTypes.FETCH_QUEUES)));
            })
            .catch(() => dispatch(actionFailed(StatusActionTypes.FETCH_QUEUES)));
    };
};

export interface SetQueuesActionInterface extends Action {
    type: QueuesActionTypes.SET_QUEUES;
    payload: {
        queues: QueueInterface[],
    };
}

export const setQueues: ActionCreator<SetQueuesActionInterface> = (
    queues: QueueInterface[],
) => {
    return {
        type: QueuesActionTypes.SET_QUEUES,
        payload: {
            queues,
        },
    };
};

export interface FlushQueuesActionInterface extends Action {
    type: QueuesActionTypes.FLUSH_QUEUES;
    payload: {};
}

export const createQueue = (
    name: string,
): ThunkResult<Promise<void>> => {
    return (dispatch) => {
        return getClient()
            .then((client: any) => {
                dispatch(actionStarted(StatusActionTypes.CREATE_QUEUE));

                return client.apis.queues.createQueue({}, { requestBody: { name } })
                    .then(() => dispatch(fetchQueues()))
                    .then(() => dispatch(actionFinished(StatusActionTypes.CREATE_QUEUE)))
                    // TODO: build an interface for this
                    .catch(({ message, response }: { message: string, response: any }) => {
                        dispatch(actionFailed(
                            StatusActionTypes.CREATE_QUEUE,
                            response.body || message,
                        ));
                        return Promise.reject(); // todo: check how we do it at igabinet
                    });
            });
    };
};

export const removeQueue = (
    queue: QueueInterface,
): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        const client = await getClient();

        // TODO: test this
        dispatch(actionStarted(
            StatusActionTypes.REMOVE_QUEUE,
            { id: queue.id },
        ));

        try {
            await client.apis.queues.removeQueue({ queue_id: queue.id });
            dispatch(fetchQueues());
            dispatch(actionFinished(StatusActionTypes.REMOVE_QUEUE));
        } catch ({ message, response }) {
            dispatch(actionFailed(
                StatusActionTypes.REMOVE_QUEUE,
                response.body || message,
            ));
            return Promise.reject(); // todo: check how we do it at igabinet
        }
    };
};
