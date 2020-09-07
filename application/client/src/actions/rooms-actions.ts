import { getClient } from '../api/client';
import { StatusActionTypes, withStatus } from './status-actions';
import { Action } from 'redux';
import { IRoom } from './types';
import { fetchQueue } from './queues-actions';

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

export const createRoom = (queueId: number, name: string): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        const client = await getClient();

        const response = await dispatch(withStatus(
            StatusActionTypes.CREATE_ROOM,
            () => client.apis.rooms.createRoom({ queue_id: queueId }, { requestBody: { name } }),
        ));

        dispatch(fetchQueue(queueId));
    };
};
