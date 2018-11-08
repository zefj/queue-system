const joi = require('joi');
const errors = require('common-errors');

import Queue from './queue-model';

export const getQueueById = (id: number): Promise<Queue> => {
    return Queue.query()
        .where('id', id)
        .first()
        .then((queue: Queue | undefined) => {
            if (!queue) {
                throw new errors.NotFoundError(`Queue of id ${id} does not exist.`);
            }

            return queue;
        })
};

export const create = (name: string): Promise<Queue> => {
    const schema = joi.string().alphanum().max(32).required(); // TODO: allow more than alphanum

    joi.validate(name, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Queue.query()
        .insert({ name });
};

export const remove = (queueId: number): Promise<number> => {
    return Queue.query()
        .deleteById(queueId);
};
