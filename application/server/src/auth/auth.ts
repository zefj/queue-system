import * as passport from 'passport';
import * as errors from 'common-errors';

import User from '../users/user-model';
import UserAccessToken from './user-access-token-model';

import {
    Strategy as JwtStrategy,
    ExtractJwt,
} from 'passport-jwt';
import * as crypto from 'crypto';

const authHeaderBearerExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();

const options = {
    jwtFromRequest: authHeaderBearerExtractor,
    secretOrKey: 'SECRET',
    issuer: 'Example',
    passReqToCallback: true,
};

const registerAuthStrategies = () => {
    passport.use(new JwtStrategy(options, (req, payload, done) => {
        const token = authHeaderBearerExtractor(req);
        // TODO: validate expiration

        const tokenHash = crypto.createHash('sha256').update(token).digest('hex').toString();

        // TODO: this makes two DB requests on every auth, however it is fundamental for providing token revocation and
        // authorized clients lists. If this starts to cause issues, you can try a join on the foreign key, or consider
        // alternative strategies and/or token+user storages.
        return UserAccessToken.query()
            .where('token_hash', tokenHash)
            .andWhere('user_id', payload.user_id)
            .first()
            .then((userAccessToken: UserAccessToken | undefined) => {
                if (!userAccessToken) {
                    // note: this error does not propagate to the response, it's useful for debugging purposes though
                    done(new Error(
`JWT authentication error: tried ${tokenHash} for user ${payload.user_id}, but token record was not found.`,
                    ));
                    return null;
                }

                return userAccessToken
                    .$relatedQuery<User>('users')
                    .context({ tenant: payload.tenant })
                    .first()
                    .then((user: User | undefined) => {
                        // The returns are here to avoid a warning "a promise was created in a handler at
                        // domain.js:314:12 but was not returned from it"
                        if (!user) {
                            done(new Error('User not found.'));
                            return null;
                        }

                        done(null, user);
                        return null;
                    });

            });
    }));
};

const userAuthWall = (req, res, next) => {
    return passport.authenticate(
        'jwt',
        // @ts-ignore
        (error: any, user: any, info: any) => {
            // How this works:
            // error - populated if you explicitly pass the first argument to done() callback in the strategy.
            // Will exist if user is not found.
            // user - populated if you return a user object from the strategy
            // info - populated if there is an error while validating the JWT or basically any other error.
            // This most likely holds any errors related to token validation.
            if (error || info || !user) {
                const message = (error && error.message) || (info && info.message) || 'User not found.';

                // Consider upping the log level on this. Is this something we'd be interested in logs?
                // Note: there are two "levels" of errors here, those resulting in the user not found,
                // eg. somebody tries to authenticate with a token after his user has been deleted, and those
                // resulting from failed token validation, eg. malformed or invalid token, malformed request header.
                // We might want to monitor some types of token errors, for example those that might indicate
                // a malicious intent of any kind.
                logger.debug(`Failed to authenticate with message: ${message}`);

                // Avoid leaking error messages to the client
                return next(new errors.AuthenticationRequiredError('Invalid token.'));
            }

            logger.debug(`Authenticated request, user: ${user.username}`);

            req.locals.user = user;

            return next();
        },
        { session: false },
    )(req, res, next);
};

export default {
    registerAuthStrategies,
    userAuthWall,
};
