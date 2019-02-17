import * as _ from 'lodash';

import { RootState } from './root-reducer';
import { IQueueWithRooms, IRoom } from '../actions/types';
import { QueuesActions, QueuesActionTypes } from '../actions/queues-actions';

export type QueuesById = {
    [s: string]: IQueueWithRooms,
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
                    (obj: any, item: IQueueWithRooms) => {
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
export const getQueue = (id: number, state: RootState): IQueueWithRooms | undefined => {
    return _.get(state.queues.list, id);

    if (_.isEmpty(state.queues.list)) {
        return undefined;
    }

    return (state.queues.list as QueuesById)[id];
};
export const getQueuesById = (state: RootState) => state.queues.list;
export const getQueuesList = (state: RootState): IQueueWithRooms[] | [] => {
    if (_.isEmpty(state.queues.list)) {
        return [];
    }

    return Object.values(state.queues.list as QueuesById);
};

export const getQueueRooms = (id: number, state: RootState): IRoom[] | [] => {
    return _.get(state.queues.list, `${id}.rooms`, []) as IRoom[] | [];
};
