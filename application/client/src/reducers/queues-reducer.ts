import * as _ from 'lodash';

import { RootState } from './root-reducer';
import { IQueueWithStats } from '../actions/types';
import { QueuesActions, QueuesActionTypes } from '../actions/queues-actions';

export type QueuesById = {
    [s: string]: IQueueWithStats,
};

export interface QueuesState {
    readonly list: QueuesById | null;
}

const initialState: QueuesState = {
    list: null,
};

export const queuesReducer = (
    state = initialState,
    action: any,
): QueuesState => {
    switch ((action as QueuesActions).type) {
        case QueuesActionTypes.SET_QUEUES:
            return {
                ...state,
                list: action.payload.queues.reduce(
                    (obj: any, item: IQueueWithStats) => {
                        obj[item.id] = item;
                        return obj;
                    },
                    {},
                ),
            };
        case QueuesActionTypes.SET_QUEUE:
            return {
                ...state,
                list: {
                    ...state.list,
                    [action.payload.queue.id]: action.payload.queue,
                },
            };
        default:
            return state;
    }
};

// export const getQueue = (state: RootState, id: number) => _.find(state.queues.list, a => a.id === id);
export const getQueue = (id: number, state: RootState): IQueueWithStats | undefined => {
    return _.get(state.queues.list, id);

    if (_.isEmpty(state.queues.list)) {
        return undefined;
    }

    return (state.queues.list as QueuesById)[id];
};
export const getQueuesById = (state: RootState) => state.queues.list;
export const getQueuesList = (state: RootState): IQueueWithStats[] | [] => {
    if (_.isEmpty(state.queues.list)) {
        return [];
    }

    return Object.values(state.queues.list as QueuesById);
};
