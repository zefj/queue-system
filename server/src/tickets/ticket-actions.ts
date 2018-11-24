const errors = require('common-errors');

import * as _ from 'lodash';

import Ticket from './ticket-model';
import Queue from '../queues/queue-model';
import Room from '../rooms/room-model';

import { getQueueById } from '../queues/queue-actions';

export const create = (queueId: number): Promise<Ticket> => {
    return getQueueById(queueId)
        .then((queue: Queue) => {
            return queue
                .$relatedQuery<Ticket>('tickets')
                .orderBy('number', 'desc')
                .first()
                .then((ticket: Ticket | undefined) => {
                    // todo: implement this as a function to facilitate letter-prefix needs. parseInt for now since we
                    // don't have that functionality yet
                    const number = (
                        parseInt(
                            _.get(ticket, 'number') || 0,
                            10,
                        ) + 1
                    ).toString();

                    return queue
                        .$relatedQuery<Ticket>('tickets')
                        .insert({ number });
                });
        });
};

export const remove = (ticketId: number): Promise<number> => {
    return Ticket.query()
        .deleteById(ticketId);
};

export const serve = (ticketId: number, roomId: number): Promise<Ticket> => {
    return Room.query()
        .where('id', roomId)
        .first()
        .then((room: Room | undefined) => {
            if (!room) {
                throw new errors.NotFoundError(`Room of id ${roomId} does not exist.`);
            }

            return room;
        })
        .then((room: Room) => {
            return Ticket.query()
                .where('id', ticketId)
                .first()
                .then((ticket: Ticket | undefined) => {
                    if (!ticket) {
                        throw new errors.NotFoundError(`Ticket of id ${ticketId} does not exist.`);
                    }

                    if (ticket.served) {
                        throw new errors.NotPermittedError(`Ticket of id ${ticketId} has already been served.`);
                    }

                    if (ticket.queue_id !== room.queue_id) {
                        throw new errors.NotPermittedError(`Cannot serve ticket of id ${ticketId} in room ${roomId}. Entities belong to different queues.`);
                    }

                    return ticket;
                })
                .then((ticket: Ticket) => {
                    return ticket.$query()
                        .patchAndFetch({ served: true, serving_room: room.id });
                });
        });
};

export const serveNext = (roomId: number): Promise<Ticket> => {
    return Room.query()
        .where('id', roomId)
        .first()
        .then((room: Room | undefined) => {
            if (!room) {
                throw new errors.NotFoundError(`Room of id ${roomId} does not exist.`);
            }

            return room;
        })
        .then((room: Room) => {
            return Ticket.query()
                .where('queue_id', room.queue_id)
                .andWhere('served', false)
                .whereNull('serving_room')
                .orderBy('number', 'asc') // todo: sort by ID, not number?
                .first()
                .then((ticket: Ticket | undefined) => {
                    if (!ticket) {
                        throw new errors.NotPermittedError('No more tickets to serve.');
                    }

                    return ticket;
                })
                .then((ticket: Ticket) => {
                    return ticket.$query()
                        .patchAndFetch({ served: true, serving_room: room.id });
                });
        });
};
