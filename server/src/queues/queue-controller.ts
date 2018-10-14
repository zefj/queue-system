import { Request, Response } from 'express';
const Joi = require('joi');
const errors = require('common-errors');

import { Sequelize } from 'sequelize';
const sequelize: Sequelize = require('../database');
const Queue = sequelize.import('./queue-model');

export const getAll: Function = (req: Request, res: Response, next: any) => {
    return Queue.findAll()
        .then((queues) => res.json({ queues }))
        .catch(next);
};

export const create: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        name: Joi.string().alphanum().max(32).required(), // TODO: allow more than alphanum
    });

    Joi.validate(req.body, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    // TODO: catch the constraint exception like in server/src/rooms/room-controller.ts:61
    return Queue
        .create({ name: req.body.name })
        .then((queue) => res.json({ success: true, queue }))
        .catch(next);
};

export const remove: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        name: Joi.string().alphanum().max(32).required(), // TODO: remove by id?
    });

    Joi.validate(req.body, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Queue
        .findOne({ where: { name: req.body.name } })
        .then((queue) => {
            if (!queue) {
                throw new errors.NotFoundError(`Queue of name ${req.body.name} does not exist.`);
            }

            return Queue
                .destroy({ where: { name: req.body.name } })
                .then(() => res.json({ success: true }));
        })
        .catch(next);
};
