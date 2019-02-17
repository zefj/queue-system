import { StatusAction } from './status-actions';
import { QueuesActions } from './queues-actions';
import { RoomsActions } from './rooms-actions';

export interface IQueue {
    id: number;
    tenant: string;
    name: string;
    mode: QueueModes;
    created_at: string;
    updated_at: string;
}

export enum QueueModes {
    FREE = 'free',
    SEQUENTIAL = 'sequential',
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
    created_at: string;
    updated_at: string;
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
