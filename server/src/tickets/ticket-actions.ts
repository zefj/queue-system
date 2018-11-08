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
                    const number = (_.get(ticket, 'number') || 0) + 1;

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
                .where('served', false)
                .whereNull('serving_room')
                .orderBy('number', 'asc')
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
