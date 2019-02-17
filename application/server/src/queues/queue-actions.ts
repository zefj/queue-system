const errors = require('common-errors');

import Queue, { QueueModes } from './queue-model';
import { NotPermittedError } from '../utils/NotPermittedError';

export interface IGetQueuesQueryResult extends Queue {
    rooms_count: number;
    tickets_count: number;
}

export const getQueues = (tenant: string): Promise<IGetQueuesQueryResult[]> => {
    return Queue.query().context({ tenant })
        .select([
            'queues.*',
            Queue.relatedQuery('rooms').context({ tenant }).count().as('rooms_count'),
            Queue.relatedQuery('tickets').context({ tenant }).count().as('tickets_count'),
        ])
        // objectionjs thinks this is Queue[], and it is, but Queue is extended due to the select above
        .then((queues: any) => {
            return queues as IGetQueuesQueryResult[];
        });
};

export const getQueueById = (tenant, id: number): Promise<Queue> => {
    return Queue.query().context({ tenant })
        .where('id', id)
        .first()
        .then((queue: Queue | undefined) => {
            if (!queue) {
                throw new errors.NotFoundError(`Queue of id ${id} does not exist.`);
            }

            return queue;
        });
};

export const create = (tenant: string, name: string, mode: QueueModes): Promise<Queue> => {
    return Queue.query().context({ tenant })
        .insert({ name, mode })
        .catch((error: Error) => {
            if (error instanceof Queue.errors.UniqueViolationError) {
                throw new NotPermittedError('ALREADY-EXISTS', `Queue of name ${name} already exists.`);
            }

            throw error;
        });
};

export const remove = (tenant: string, queueId: number): Promise<number> => {
    // TODO: add some validation and removal constraints
    // possible constraints:
    // - existing rooms
    // - unserved tickets
    return Queue.query().context({ tenant })
        .deleteById(queueId);
};
