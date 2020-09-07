/* tslint:disable:variable-name */
import { TimestampsMixin, TenantModel } from '../database';
import { Model } from 'objection';

export default class User extends TimestampsMixin(TenantModel) {
    static tableName = 'users';

    readonly id!: number;
    username!: string;
    password!: string;
    email!: string;

    static relationMappings = {
        user_access_tokens: {
            relation: Model.HasManyRelation,
            modelClass: `${__dirname}/../auth/user-access-token-model.ts`,
            join: {
                from: 'users.id',
                to: 'user_access_tokens.user_id',
            },
        },
    };
}
