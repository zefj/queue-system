import { Request, Response } from 'express';
const joi = require('joi');
const errors = require('common-errors');

import Room from './room-model';

import {
    getForQueue,
    create as createRoom,
    remove as removeRoom,
} from './room-actions';

export const get: Function = (req: Request, res: Response, next: any) => {
    const schema = joi.object().keys({
        queue: joi.number().integer().required(),
    });

    joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return getForQueue(req.locals.tenant, req.params.queue)
        .then((rooms: Room[]) => res.json({ rooms }))
        .catch(next);
};

export const create: Function = (req: Request, res: Response, next: any) => {
    // name validation in action
    const schema = joi.object().keys({
        queue: joi.number().integer().required(),
    });

    joi.validate(req.params, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return createRoom(req.locals.tenant, req.params.queue, req.body.name)
        .then((room: Room) => res.json({ room, success: true }))
        .catch(next);
};

export const remove: Function = (req: Request, res: Response, next: any) => {
    const schema = joi.number().integer().required();

    joi.validate(req.params.room, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return removeRoom(req.locals.tenant, req.params.room)
        .then((removed: number) => res.json({ removed })) // TODO: consider: error on not removed?
        .catch(next);
};
