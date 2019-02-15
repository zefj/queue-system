import { RootState } from './root';
import { IRoom } from '../actions/types';
import { RoomsActions, RoomsActionTypes } from '../actions/rooms';

export interface RoomsState {
    readonly data: IRoom[] | null;
}

const initialState: RoomsState = {
    data: null,
};

export const rooms = (
    state = initialState,
    action: any,
): RoomsState => {
    switch ((action as RoomsActions).type) {
        case RoomsActionTypes.SET_QUEUE_ROOMS:
            return {
                ...state,
                data: action.payload.rooms,
            };
        default:
            return state;
    }
};

export const getRooms = (state: RootState) => state.rooms.data;
