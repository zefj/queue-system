const dbErrors = require('db-errors');

import { Constructor, Model, QueryBuilder, Transaction } from 'objection';

export default class BaseModel extends Model {
    static query<QM extends Model>(this: Constructor<QM>, trx?: Transaction): QueryBuilder<QM> {
        return super.query.apply(this, trx)
            .onError((err) => {
                return Promise.reject(dbErrors.wrapError(err));
            }) as QueryBuilder<QM>;
    }

    static errors = {
        DBError: dbErrors.DBError,
        UniqueViolationError: dbErrors.UniqueViolationError,
        NotNullViolationError: dbErrors.NotNullViolationError,
        ForeignKeyViolationError: dbErrors.ForeignKeyViolationError,
        ConstraintViolationError: dbErrors.ConstraintViolationError,
        CheckViolationError: dbErrors.CheckViolationError,
        DataError: dbErrors.DataError,
    };
}
