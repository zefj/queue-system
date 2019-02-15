import { getClient } from '../api/client';
import { StatusActionTypes, withStatus } from './status';
import { Action } from 'redux';
import { IRoom } from './types';

export enum RoomsActionTypes {
    SET_QUEUE_ROOMS = 'SET_QUEUE_ROOMS',
}

export type RoomsActions = ISetQueueRoomsAction;

export interface ISetQueueRoomsAction extends Action {
    type: RoomsActionTypes.SET_QUEUE_ROOMS;
    payload: {
        rooms: IRoom[],
    };
}

export const setQueueRooms = (
    rooms: IRoom[],
): ISetQueueRoomsAction => {
    return {
        type: RoomsActionTypes.SET_QUEUE_ROOMS,
        payload: {
            rooms,
        },
    };
};

export const fetchRoomsForQueue = (queueId: number): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        const client = await getClient();

        const response = await dispatch(withStatus(
            StatusActionTypes.FETCH_QUEUE_ROOMS,
            () => client.apis.queues.getRoomsForQueue(queueId),
        ));

        dispatch(setQueueRooms(response.body.rooms));
    };
};
