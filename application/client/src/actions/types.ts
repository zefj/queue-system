import { StatusAction } from './status-actions';
import { QueuesActions } from './queues-actions';
import { RoomsActions } from './rooms-actions';

export interface IQueue {
    id: number;
    tenant: string;
    name: string;
    created: string;
    updated: string;
}

export interface IQueueWithStats extends IQueue {
    rooms_count: number;
    tickets_count: number;
}

export interface IRoom {
    id: number;
    tenant: string;
    name: string;
    queue_id: number;
    created: string;
    updated: string;
}

export type Actions = QueuesActions | StatusAction | RoomsActions;

export interface ServerException {
    message: string;
    type: string;
    error?: string;
    stack?: string;
    description?: ValidationErrorDescription;
}

export interface ValidationErrorDescription {
    [name: string]: {
        key: string,
        type: string,
        message: string,
    };
}
