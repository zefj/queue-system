import { Request, Response } from 'express';
const Joi = require('joi');
const errors = require('common-errors');

import * as Sequelize from 'sequelize';
const sequelize: Sequelize.Sequelize = require('../database');
const Ticket = sequelize.import('./ticket-model');

export const create: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        queue: Joi.string().alphanum().max(32).required(),
    });

    Joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Ticket
        .findOne({
            where: { queue_id: req.params.queue },
            order: [['number', 'DESC']],
        })
        .then((ticket: any) => {
            let number = 1;

            if (ticket) {
                number = ticket.number + 1;
            }

            return Ticket
                .create({ queue_id: req.params.queue, number })
                .then((ticket: Object) => res.json({ success: true, ticket }));
        })
        .catch((error: Object) => {
            let exception = error;

            if (error instanceof sequelize.ForeignKeyConstraintError) {
                exception = new errors.NotFoundError(`Queue of name ${req.params.queue} does not exist.`);
            }

            return next(exception);
        });
};

export const createMany: Function = (req: Request, res: Response, next: any) => {
    console.log(typeof req.body.tickets, req.body.tickets);
    const schema = Joi.object().keys({
        params: {
            queue: Joi.string().alphanum().max(32).required(),
        },
        body: {
            tickets: Joi.array().items(
                Joi.object(),
            ),
        },
    }).unknown(true);

    Joi.validate(req, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Ticket
        .findOne({
            where: { queue_id: req.params.queue },
            order: [['number', 'DESC']],
        })
        .then((ticket: any) => {
            let number = 0; // Will increment in .map()

            if (ticket) {
                number = ticket.number; // Will increment in .map()
            }

            return req.body.tickets.map(() => {
                number = number + 1;
                return { queue_id: req.params.queue, number };
            });
        })
        .then((tickets: Array<Object>) => Ticket
            .bulkCreate(tickets)
            .then((result: Object) => res.json({ success: true, tickets: result })),
        )
        .catch((error: Object) => {
            let exception = error;

            if (error instanceof sequelize.ForeignKeyConstraintError) {
                exception = new errors.NotFoundError(`Queue of name ${req.params.queue} does not exist.`);
            }

            return next(exception);
        });
};

export const remove: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        params: {
            queue: Joi.string().alphanum().max(32).required(),
            ticket: Joi.number().required(),
        },
    }).unknown(true);

    Joi.validate(req, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    throw new Error('Not implemented');
};

export const serve: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        queue: Joi.number().required(),
        room: Joi.number().required(),
        ticket: Joi.number().required(),
    });

    Joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    // TODO: better error handling
    return Ticket
        .update(
            /* tslint:disable:ter-indent */
            { served: true, serving_room: req.params.room },
            {
                where: {
                    queue_id: req.params.queue,
                    number: req.params.ticket,
                    served: false,
                    serving_room: {
                        [sequelize.Op.eq]: null,
                    },
                },
            },
            /* tslint:enable:ter-indent */
        )
        .then((result: any) => {
            if (result[0] === 0) { // todo for some reason update() returns an array
                throw new errors.NotFoundError('Ticket does not exist or has already been served.');
            }

            return res.json({ success: true, result });
        })
        .catch(next);
};

export const serveNext: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        queue: Joi.string().alphanum().max(32).required(),
        room: Joi.string().alphanum().max(32).required(),
    });

    Joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Ticket
        .findOne({
            where: {
                queue_id: req.params.queue,
                served: false,
                serving_room: {
                    [sequelize.Op.eq]: null,
                },
            },
            order: [['number', 'ASC']],
        })
        .then((ticket: any) => {
            if (!ticket) {
                throw new errors.NotFoundError('No tickets left.');
            }

            ticket.set({ served: true, serving_room: req.params.room });
            return ticket.save();
        })
        .then((result: any) => {
            return res.json({ success: true, result }); // TODO: sanitize result record (remove timestamps)
        })
        .catch(next);
};
