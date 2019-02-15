import { Request, Response } from 'express';
const joi = require('joi');
const errors = require('common-errors');

import Queue from './queue-model';

import {
    create as createQueue, getQueueById,
    getQueues,
    remove as removeQueue,
} from './queue-actions';

export const getAll: Function = (req: Request, res: Response, next: any) => {
    return getQueues(req.locals.tenant)
        .then(queues => res.json({ queues }))
        .catch(next);
};

export const getOne = (req: Request, res: Response, next: any) => {
    const schema = joi.number().integer().required();

    joi.validate(req.params.queue, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return getQueueById(req.locals.tenant, req.params.queue)
        .then(queue => res.json({ queue }))
        .catch(next);
};

export const create: Function = (req: Request, res: Response, next: any) => {
    // name validation in action
    return createQueue(req.locals.tenant, req.body.name)
        .then((queues: Queue) => res.json({ queues }))
        .catch(next);
};

export const remove: Function = (req: Request, res: Response, next: any) => {
    const schema = joi.number().integer().required();

    joi.validate(req.params.queue, schema, (error: Error) => {
        if (!error) {
            return;
        }

        throw new errors.ValidationError(error.message);
    });

    return removeQueue(req.locals.tenant, req.params.queue)
        .then((removed: number) => res.json({ removed })) // TODO: consider: error on not removed?
        .catch(next);
};
