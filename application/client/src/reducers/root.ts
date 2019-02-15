import { combineReducers } from 'redux';

import { queues, QueuesState } from './queues';
import { status, StatusState } from './status';
import { rooms, RoomsState } from './rooms';

export interface RootState {
    queues: QueuesState;
    status: StatusState;
    rooms: RoomsState;
}

export const root = combineReducers({ queues, status, rooms });
