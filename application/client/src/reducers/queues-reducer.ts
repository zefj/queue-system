import { RootState } from './root-reducer';
import { IQueueWithStats } from '../actions/types';
import { QueuesActions, QueuesActionTypes } from '../actions/queues-actions';

export interface QueuesState {
    readonly data: IQueueWithStats[] | null;
}

const initialState: QueuesState = {
    data: null,
};

export const queuesReducer = (
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
