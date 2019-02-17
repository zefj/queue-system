import { NotPermittedError } from '../utils/NotPermittedError';

const joi = require('joi');
const errors = require('common-errors');

import Room from './room-model';
import Queue from '../queues/queue-model';

import Bus from '../bus';

import {
    RoomCreatedEvent,
} from './events';

import { getQueueById } from '../queues/queue-actions';

export const getForQueue = (tenant, queueId: number): Promise<Room[]> => {
    return Room.query().context({ tenant })
        .where('queue_id', queueId);
};

export const create = (tenant, queueId: number, name: string): Promise<Room> => {
    const schema = joi.string().max(32).required(); // TODO: allow more than alphanum

    joi.validate(name, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return getQueueById(tenant, queueId)
        .then((queue: Queue) => {
            return queue
                .$relatedQuery<Room>('rooms')
                .context({ tenant })
                .insert({ name })
                .catch((error: Error) => {
                    if (error instanceof Room.errors.UniqueViolationError) {
                        throw new NotPermittedError('ALREADY-EXISTS', `Room of name ${name} already exists.`);
                    }

                    throw error;
                })
                .then((room: Room) => {
                    // TODO; consider if this event is needed
                    const event = new RoomCreatedEvent(tenant, room);
                    Bus.emit(event);
                    return room;
                });
        });
};

export const remove = (tenant, roomId: number): Promise<number> => {
    return Room.query().context({ tenant })
        .deleteById(roomId);
};
