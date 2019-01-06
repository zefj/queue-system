/* tslint:disable:variable-name */
import * as uuid from 'uuid/v4';

import {
    QueryContext,
} from 'objection';
import { TimestampsMixin, BaseModel } from '../database';

export default class Tenant extends TimestampsMixin(BaseModel) {
    static tableName = 'tenants';

    id!: number;
    name!: string;

    $beforeInsert(queryContext: QueryContext): Promise<any> | void {
        this.id = uuid();
    }

    // static relationMappings = {
    //     queues: {
    //         relation: Model.HasManyRelation,
    //         modelClass: `${__dirname}/../queues/queue-model.ts`,
    //         join: {
    //             from: 'tenants.id',
    //             to: 'queues.tenant',
    //         },
    //     },
    //     tickets: {
    //         relation: Model.HasManyRelation,
    //         modelClass: `${__dirname}/../tickets/ticket-model.ts`,
    //         join: {
    //             from: 'tenants.id',
    //             to: 'tickets.tenant',
    //         },
    //     },
    //     rooms: {
    //         relation: Model.HasManyRelation,
    //         modelClass: `${__dirname}/../tickets/ticket-model.ts`,
    //         join: {
    //             from: 'tenants.id',
    //             to: 'tickets.tenant',
    //         },
    //     },
    // };
}
