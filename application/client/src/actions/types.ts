import { StatusAction } from './status';
import { QueuesActions } from './queues';

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

export type Actions = QueuesActions | StatusAction;

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
