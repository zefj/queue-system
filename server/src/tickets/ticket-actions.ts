const errors = require('common-errors');

import * as _ from 'lodash';

import Ticket from './ticket-model';
import Queue from '../queues/queue-model';
import Room from '../rooms/room-model';

import { getQueueById } from '../queues/queue-actions';

import incrementIdentifier from './ticket-numbering';

export const create = (tenant, queueId: number): Promise<Ticket> => {
    return getQueueById(tenant, queueId)
        .then((queue: Queue) => {
            return queue
                .$relatedQuery<Ticket>('tickets')
                .context({ tenant })
                .orderBy('id', 'desc')
                .first()
                .then((ticket: Ticket | undefined) => {
                    // TOdo: replace '0' with an identifier-generator function
                    const number = incrementIdentifier(
                        _.get(ticket, 'number') || '0',
                        Ticket.numberRegex, // todo: this should be configurable on a per-queue basis
                        Ticket.incrementRegexGroup,
                    );

                    return queue
                        .$relatedQuery<Ticket>('tickets')
                        .context({ tenant })
                        .insert({ number });
                });
        });
};

export const remove = (tenant, ticketId: number): Promise<number> => {
    return Ticket.query().context({ tenant })
        .deleteById(ticketId);
};

export const serve = (tenant, ticketId: number, roomId: number): Promise<Ticket> => {
    return Room.query().context({ tenant })
        .where('id', roomId)
        .first()
        .then((room: Room | undefined) => {
            if (!room) {
                throw new errors.NotFoundError(`Room of id ${roomId} does not exist.`);
            }

            return room;
        })
        .then((room: Room) => {
            return Ticket.query().context({ tenant })
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
                        .context({ tenant })
                        .patchAndFetch({ served: true, serving_room: room.id });
                });
        });
};

export const serveNext = (tenant, roomId: number): Promise<Ticket> => {
    return Room.query().context({ tenant })
        .where('id', roomId)
        .first()
        .then((room: Room | undefined) => {
            if (!room) {
                throw new errors.NotFoundError(`Room of id ${roomId} does not exist.`);
            }

            return room;
        })
        .then((room: Room) => {
            return Ticket.query().context({ tenant })
                .where('queue_id', room.queue_id)
                .andWhere('served', false)
                .whereNull('serving_room')
                .orderBy('id', 'asc') // todo: sort by ID, not number?
                .first()
                .then((ticket: Ticket | undefined) => {
                    if (!ticket) {
                        throw new errors.NotPermittedError('No more tickets to serve.');
                    }

                    return ticket;
                })
                .then((ticket: Ticket) => {
                    return ticket.$query()
                        .context({ tenant })
                        .patchAndFetch({ served: true, serving_room: room.id });
                });
        });
};
