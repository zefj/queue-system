const joi = require('joi');
const errors = require('common-errors');

import Queue from './queue-model';

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

export const create = (tenant: string, name: string): Promise<Queue> => {
    const schema = joi.string().max(32).required(); // TODO: allow more than alphanum

    joi.validate(name, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Queue.query().context({ tenant })
        .insert({ name });
};

export const remove = (tenant: string, queueId: number): Promise<number> => {
    return Queue.query().context({ tenant })
        .deleteById(queueId);
};
