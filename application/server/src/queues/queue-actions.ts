import Room from '../rooms/room-model';

const errors = require('common-errors');

import Queue, { QueueModes } from './queue-model';
import { NotPermittedError } from '../utils/NotPermittedError';

// Do we need this?
export interface IQueueWithRooms {
    rooms: Room[];
}

export const getQueues = (tenant: string): Promise<IQueueWithRooms[]> => {
    return Queue.query().context({ tenant })
        .eager('rooms')
        .then((queues: Queue[]) => {
            return queues as IQueueWithRooms[];
        });
};

export const getQueueById = (tenant, id: number): Promise<IQueueWithRooms> => {
    return Queue.query().context({ tenant })
        .eager('rooms')
        .where('id', id)
        .first()
        .then((queue: Queue | undefined) => {
            if (!queue) {
                throw new errors.NotFoundError(`Queue of id ${id} does not exist.`);
            }

            return queue as IQueueWithRooms;
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
