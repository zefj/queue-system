import { client, getClient } from '../api/client';
import { QueueInterface } from './types';
import { setActionStatus, StatusActionTypes } from './status';
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
                dispatch(setActionStatus(StatusActionTypes.FETCH_QUEUES, 'started'));

                return client.apis.queues.getQueues()
                    .then((response: any) => dispatch(setQueues(response.body.queues)))
                    .then(() => dispatch(setActionStatus(StatusActionTypes.FETCH_QUEUES, 'finished')));
            })
            .catch(() => dispatch(setActionStatus(StatusActionTypes.FETCH_QUEUES, 'errored')));
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
                dispatch(setActionStatus(StatusActionTypes.CREATE_QUEUE, 'started'));

                return client.apis.queues.createQueue({}, { requestBody: { name } })
                    .then(() => dispatch(fetchQueues()))
                    .then(() => dispatch(setActionStatus(StatusActionTypes.CREATE_QUEUE, 'finished')))
                    // TODO: build an interface for this
                    .catch(({ message, response }: { message: string, response: any }) => {
                        dispatch(setActionStatus(
                            StatusActionTypes.CREATE_QUEUE,
                            'errored',
                            response.body || message,
                        ));
                        return Promise.reject(); // todo: check how we do it at igabinet
                    });
            });
    };
};
