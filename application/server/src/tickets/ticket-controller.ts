import { Request, Response } from 'express';
const joi = require('joi');
const errors = require('common-errors');

import {
    create as createTicket,
    remove as removeTicket,
    serve as serveTicket,
    serveNext as serveNextTicket,
} from './ticket-actions';

import Ticket from './ticket-model';

export const create: Function = (req: Request, res: Response, next: any) => {
    const schema = joi.number().integer().required();

    joi.validate(req.params.queue, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return createTicket(req.locals.tenant, req.params.queue)
        .then((ticket: Ticket) => res.json({ ticket }))
        .catch(next);
};

// export const createMany: Function = (req: Request, res: Response, next: any) => {
//     const schema = joi.object().keys({
//         params: {
//             queue: joi.string().alphanum().max(32).required(),
//         },
//         body: {
//             tickets: joi.array().items(
//                 joi.object(),
//             ),
//         },
//     }).unknown(true);
//
//     joi.validate(req, schema, (error: Error) => {
//         if (!error) {
//             return;
//         }
//
//         throw new errors.ValidationError(error.message);
//     });
//
//     return Ticket
//         .findOne({
//             where: { queue_id: req.params.queue },
//             order: [['number', 'DESC']],
//         })
//         .then((ticket: any) => {
//             let number = 0; // Will increment in .map()
//
//             if (ticket) {
//                 number = ticket.number; // Will increment in .map()
//             }
//
//             return req.body.tickets.map(() => {
//                 number = number + 1;
//                 return { queue_id: req.params.queue, number };
//             });
//         })
//         .then((tickets: Array<Object>) => Ticket
//             .bulkCreate(tickets)
//             .then((result: Object) => res.json({ success: true, tickets: result })),
//         )
//         .catch((error: Object) => {
//             let exception = error;
//
//             if (error instanceof sequelize.ForeignKeyConstraintError) {
//                 exception = new errors.NotFoundError(`Queue of name ${req.params.queue} does not exist.`);
//             }
//
//             return next(exception);
//         });
// };

export const remove: Function = (req: Request, res: Response, next: any) => {
    const schema = joi.number().integer().required();

    joi.validate(req.params.ticket, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return removeTicket(req.locals.tenant, req.params.ticket)
        .then((ticket: Ticket) => res.json({ ticket }))
        .catch(next);
};

export const serve: Function = (req: Request, res: Response, next: any) => {
    const schema = joi.object().keys({
        room: joi.number().integer().required(),
        ticket: joi.number().integer().required(),
    });

    joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return serveTicket(req.locals.tenant, req.params.ticket, req.params.room)
        .then((ticket: Ticket) => res.json({ ticket, success: true }))
        .catch(next);
};

export const serveNext: Function = (req: Request, res: Response, next: any) => {
    const schema = joi.object().keys({
        room: joi.number().integer().required(),
    });

    joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return serveNextTicket(req.locals.tenant, req.params.room)
        .then((ticket: Ticket) => res.json({ ticket, success: true }))
        .catch(next);
};
