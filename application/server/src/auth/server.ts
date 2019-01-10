// import * as passport from 'passport';
import * as oauth2orize from 'oauth2orize';
import * as jwt from 'jsonwebtoken';
import * as errors from 'common-errors';
import * as crypto from 'crypto';

import User from '../users/user-model';
import UserAccessToken from './user-access-token-model';

const server = oauth2orize.createServer();
// https://aleksandrov.ws/2013/09/12/restful-api-with-nodejs-plus-mongodb/
// TODO: add refresh tokens
const registerAuthGrantsAndExchanges = () => {
    server.exchange(function password(req, res, next) {
        // @ts-ignore
        const tenant = req.locals.tenant;

        return oauth2orize.exchange.password((client, username, password, scope, done) => {
            return User.query().context({ tenant })
                .where('username', username)
                .andWhere('password', password) // todo hash and then remove this where
                .then((foundUsers: User[]) => {
                    if (foundUsers.length === 0) {
                        return done(new errors.NotFoundError('Invalid username or password.'));
                    }

                    // Just a failsafe
                    if (foundUsers.length > 1) {
                        return done(new Error('Encountered duplicate users, something went horribly wrong.'));
                    }

                    const user = foundUsers[0];

                    const payload = {
                        tenant,
                        user_id: user.id,
                        username: user.username,
                        email: user.email,
                    };

                    // TODO: move this to config
                    const options = {
                        issuer: 'Example', // TODO
                        expiresIn: '12h',
                        algorithm: 'HS256', // TODO: RSA
                    };

                    const secret = 'SECRET'; // TODO

                    const token = jwt.sign(payload, secret, options);
                    const tokenHash = crypto.createHash('sha256').update(token).digest('hex').toString();

                    return UserAccessToken.query()
                        .insert({
                            token_hash: tokenHash,
                            user_id: user.id,
                        })
                        .then(() => {
                            logger.debug(`User authorized: ${user.username}, token: ${token}, hash: ${tokenHash}`);
                            return done(null, token);
                        });
                })
                .catch(done);
        })(req, res, next);
    });
};

export default {
    registerAuthGrantsAndExchanges,
    middleware: server.token(),
};

// export default [
//     passport.authenticate(['basic', 'oauth2-client-password'], { session: false }),
    // server.token(),
    // server.errorHandler(),
// ];
