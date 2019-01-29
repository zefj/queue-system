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
