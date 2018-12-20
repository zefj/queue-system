/* tslint:disable:variable-name */
import { Model, ModelOptions, QueryContext } from 'objection';

const TimestampsMixin = <T extends Constructor<Model>>(superclass: T) => {
    return class extends superclass {
        created_at?: string;
        updated_at?: string;

        $beforeInsert(queryContext: QueryContext) {
            this.created_at = new Date().toJSON().slice(0, 19).replace('T', ' ');
            this.updated_at = new Date().toJSON().slice(0, 19).replace('T', ' ');
            if (super.$beforeInsert) super.$beforeInsert(queryContext);
        }

        $beforeUpdate(opt: ModelOptions, queryContext: QueryContext) {
            this.updated_at = new Date().toJSON().slice(0, 19).replace('T', ' ');
            if (super.$beforeUpdate) super.$beforeUpdate(opt, queryContext);
        }
    };
};

export default TimestampsMixin;
