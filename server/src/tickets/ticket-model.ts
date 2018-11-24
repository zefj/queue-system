/* tslint:disable:variable-name */
import { Model } from 'objection';
import { TimestampsModel } from '../database';

export default class Ticket extends TimestampsModel {
    static tableName = 'tickets';
    static idColumn = 'id';

    // todo: these two should be configurable on a per-queue basis
    static numberRegex = /^([A-Z]{0,3})([0-9]{1,4})$/g;
    static incrementRegexGroup = 1;

    readonly id!: number;
    number!: string;
    queue_id!: number;
    served?: boolean;
    serving_room?: number;

    static relationMappings = {
        queues: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../queues/queue-model.ts`,
            join: {
                from: 'tickets.queue_id',
                to: 'queues.id',
            },
        },
        rooms: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../rooms/room-model.ts`,
            join: {
                from: 'tickets.serving_room',
                to: 'rooms.id',
            },
        },
    };
}
