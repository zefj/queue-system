const joi = require('joi');
const errors = require('common-errors');

import Room from './room-model';
import Queue from '../queues/queue-model';

import { getQueueById } from '../queues/queue-actions';

export const create = (queueId: number, name: string): Promise<Room> => {
    const schema = joi.string().alphanum().max(32).required(); // TODO: allow more than alphanum

    joi.validate(name, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return getQueueById(queueId)
        .then((queue: Queue) => {
            return queue
                .$relatedQuery<Room>('rooms')
                .insert({ name })
                .catch((error: Error) => {
                    if (error instanceof Room.errors.UniqueViolationError) {
                        throw new errors.NotPermittedError(`Room of name ${name} already exists.`);
                    }

                    throw error;
                });
        });
};

export const remove = (roomId: number): Promise<number> => {
    return Room.query()
        .deleteById(roomId);
};
