/* tslint:disable:variable-name */
import { Model, ModelOptions, QueryBuilder, QueryContext } from 'objection';
import BaseModel from './BaseModel';

class TenantedQueryBuilder<QM extends Model, RM, RV> extends QueryBuilder<QM, RM, RV> {
    constructor(...args) {
        // @ts-ignore
        super(...args);
        this.onBuild((builder) => {
            if (!builder.context().tenant) {
                throw new Error('TenantModel subclasses must provide \'tenant\' as query context.');
            }
            return builder.where('tenant', builder.context().tenant);
        });
    }
}

export default class TenantModel extends BaseModel {
    static get QueryBuilder() {
        return TenantedQueryBuilder;
    }

    tenant!: string;

    $beforeInsert(queryContext: QueryContext): Promise<any> | void {
        if (!queryContext.tenant) {
            throw new Error('TenantModel subclasses must provide \'tenant\' as query context.');
        }

        this.tenant = queryContext.tenant;
    }

    $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<any> | void {
        if (!queryContext.tenant) {
            throw new Error('TenantModel subclasses must provide \'tenant\' as query context.');
        }

        this.tenant = queryContext.tenant;
    }
}

// export default class TenantModel extends BaseModel {
//     static QueryBuilder = TenantedQueryBuilder;
//
//     tenant!: string;
//
//     $beforeInsert() {
//         this.tenant = 'queue_db';
//     }
//
//     $beforeUpdate() {
//         this.tenant = 'queue_db';
//     }
// }
