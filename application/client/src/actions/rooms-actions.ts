import { getClient } from '../api/client';
import { StatusActionTypes, withStatus } from './status-actions';
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
            () => client.apis.rooms.getQueueRooms({ queue_id: queueId }),
        ));

        dispatch(setQueueRooms(response.body.rooms));
    };
};

export const createRoom = (queueId: number, name: string): ThunkResult<Promise<void>> => {
    return async (dispatch) => {
        const client = await getClient();

        const response = await dispatch(withStatus(
            StatusActionTypes.CREATE_ROOM,
            () => client.apis.rooms.createRoom({ queue_id: queueId }, { requestBody: { name } }),
        ));

        dispatch(fetchRoomsForQueue(queueId));
    };
};
