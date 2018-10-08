import { Request, Response } from "express";
const Joi = require('joi');
const errors = require('common-errors');

import { Sequelize } from "sequelize";
const sequelize: Sequelize = require('../database');
const Room = sequelize.import('./room-model');

export const getAll: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        queue: Joi.number().integer().required(),
    });

    Joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Room
        .findAll({
            where: { queue_id: req.params.queue }
        })
        .then((rooms: Array<Object>) => res.json({ rooms }))
        .catch(next);
};

export const create: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        params: {
            queue: Joi.number().integer().required(),
        },
        body: {
            name: Joi.string().alphanum().max(32).required(),
        }
    }).unknown(true);

    Joi.validate(req, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Room
        .create({ queue_id: req.params.queue, name: req.body.name })
        .then((room: Object) => res.json({ success: true, room }))
        .catch((error: Object) => {
            let exception = error;

            if (error instanceof sequelize.ForeignKeyConstraintError) {
                exception = new errors.NotFoundError(`Queue of name ${req.params.queue} does not exist.`);
            }

            if (error instanceof sequelize.UniqueConstraintError) {
                exception = new errors.NotPermittedError(`Room of name ${req.body.name} already exists.`);
            }

            return next(exception);
        });
};

export const remove: Function = (req: Request, res: Response, next: any) => {
    const schema = Joi.object().keys({
        queue: Joi.string().alphanum().max(32).required(),
        room: Joi.number().integer().required(),
    });

    Joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return Room
        .destroy({ where: { id: req.params.room } })
        .then((result: Number) => {
            if (result === 0) {
                throw new errors.NotFoundError(`Room of id ${req.params.room} does not exist.`);
            }

            return res.json({ success: true });
        })
        .catch(next);
};
