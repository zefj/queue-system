import { Model } from 'objection';
import { TimestampsModel } from '../database';

export default class Room extends TimestampsModel {
    static tableName = 'rooms';
    static idColumn = 'id';

    readonly id!: number;
    name!: string;
    queue_id!: number;

    static relationMappings = {
        queues: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../queues/queue-model.ts`,
            join: {
                from: 'rooms.queue_id',
                to: 'queues.id',
            },
        },
        tickets: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/../tickets/ticket-model.ts`,
            join: {
                from: 'rooms.id',
                to: 'tickets.serving_room',
            },
        },
    };
}
