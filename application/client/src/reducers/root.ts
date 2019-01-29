import { combineReducers } from 'redux';

import { queues, QueuesState } from './queues';
import { status, StatusState } from './status';

export interface RootState {
    queues: QueuesState;
    status: StatusState;
}

export const root = combineReducers({ queues, status });
