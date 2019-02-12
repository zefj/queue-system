import { StatusActions } from './status';
import { QueuesActions } from './queues';

export interface QueueInterface {
    id: number;
    tenant: string;
    name: string;
    created: string;
    updated: string;
}

export type Actions = QueuesActions | StatusActions;

export interface ServerException {
    message: string;
    type: string;
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
