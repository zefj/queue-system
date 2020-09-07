import { combineReducers } from 'redux';

import { queuesReducer, QueuesState } from './queues-reducer';
import { statusReducer, StatusState } from './status-reducer';
import { roomsReducer, RoomsState } from './rooms-reducer';

export interface RootState {
    queues: QueuesState;
    status: StatusState;
    rooms: RoomsState;
}

export const rootReducer = combineReducers({ queues: queuesReducer, status: statusReducer, rooms: roomsReducer });
