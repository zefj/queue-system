/* tslint:disable:variable-name */
import { Model } from 'objection';
import { TimestampsMixin, TenantModel } from '../database';
import Room from '../rooms/room-model';

export enum QueueModes {
    FREE = 'free',
    SEQUENTIAL = 'sequential',
}

export default class Queue extends TimestampsMixin(TenantModel) {
    static tableName = 'queues';
    static idColumn = 'id';

    readonly id!: number;
    name!: string;
    mode!: QueueModes;
    rooms?: Partial<Room>[];

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
