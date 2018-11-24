/* tslint:disable:variable-name */
import { Model } from 'objection';

import { TimestampsModel } from '../database';

export default class Queue extends TimestampsModel {
    static tableName = 'queues';
    static idColumn = 'id';

    readonly id!: number;
    name!: string;

    static relationMappings = {
        rooms: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/../rooms/room-model.ts`,
            join: {
                from: 'queues.id',
                to: 'rooms.queue_id',
            },
        },
        tickets: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/../tickets/ticket-model.ts`,
            join: {
                from: 'queues.id',
                to: 'tickets.queue_id',
            },
        },
    };
}
