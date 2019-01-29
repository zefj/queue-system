import { RootState } from './root';
import { QueueInterface } from '../actions/types';
import { QueuesActions, QueuesActionTypes } from '../actions/queues';

export interface QueuesState {
    data: QueueInterface[] | null;
}

const initialState: QueuesState = {
    data: null,
};

export const queues = (
    state = initialState,
    action: any,
): QueuesState => {
    switch ((action as QueuesActions).type) {
        case QueuesActionTypes.SET_QUEUES:
            return {
                ...state,
                data: action.payload.queues,
            };
        default:
            return state;
    }
};

export const getQueues = (state: RootState) => state.queues.data;
