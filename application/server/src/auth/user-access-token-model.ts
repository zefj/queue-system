/* tslint:disable:variable-name */
import { TimestampsMixin, BaseModel } from '../database';
import { Model } from 'objection';

export default class UserAccessToken extends TimestampsMixin(BaseModel) {
    static tableName = 'user_access_tokens';

    readonly id!: number;
    token_hash!: string;
    user_id!: number;
    expires_in!: string;

    static relationMappings = {
        users: {
            relation: Model.BelongsToOneRelation,
            modelClass: `${__dirname}/../users/user-model.ts`,
            join: {
                from: 'user_access_tokens.user_id',
                to: 'users.id',
            },
        },
    };
}
