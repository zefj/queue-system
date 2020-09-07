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

    static _relationMappings: {};

    static get relationMappings() {
        return this._relationMappings;
    }

    // TenantModel implements a relation to the `tenants` table. This magic merges the relationMappings
    // definition of the base class with a base mapping of TenantModel class. This further accomplishes
    // a very important thing - child classes only need to extend the TenantModel to support row-level tenancy.
    // Disclaimer: I have tested it, but have no thorough understanding of why this works. Please be advised.
    static set relationMappings(mappings) {
        this._relationMappings = Object.assign(
            {},
            {
                tenants: {
                    relation: Model.BelongsToOneRelation,
                    modelClass: `${__dirname}/../tenants/tenant-model.ts`,
                    join: {
                        from: `${this.tableName}.tenant`,
                        to: 'tenants.id',
                    },
                },
            },
            mappings,
        );
    }
}
