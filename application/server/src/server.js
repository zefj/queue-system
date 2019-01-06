require('./logger');
const config = require('./config').default;

const makeServer = () => {
    const express = require('express');
    const router = require('./router');
    const bodyParser = require('body-parser');
    const Joi = require('joi');
    const errors = require('common-errors');
    const Bus = require('./bus');
    require('./database');
    const rabbitmq = require('../../lib/rabbitmq');
    const allowCrossDomain = require('./middlewares/allow-cross-domain');
    const errorHandler = require('./middlewares/error-handler');

    logger.info(`Starting server in ${config.environment } mode...`);

    const app = express();
    rabbitmq.setup(config.rabbitmq.host);

    app.use(allowCrossDomain);
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    // This is only temporary
    app.use((req, res, next) => {
        req.locals = {
            user: 'temporary-user-until-we-have-auth',
            // TODO while developing make sure this tenant exists in the DB
            tenant: '2c7783c2-53ee-48ba-bb5c-cd1f1da6ac7b',
        };

        next();
    });

    app.use((req, res, next) => {
        const schema = Joi.object().keys({
            locals: Joi.object().keys({
                user: Joi.string().required(),
                tenant: Joi.string().required(),
            }),
        }).unknown();

        Joi.validate(req, schema, (error) => {
            if (!error) {
                return next();
            }

            throw new errors.ValidationError(error.message);
        });
    });

    app.use(errors.middleware.crashProtector());

    app.use('/', router);
    app.use(errorHandler);

    Bus.registerBusEventHandlers(
        Bus.default,
        [
            require('./tickets/ticket-event-handler').default,
        ]
    );

    app.listen(config.app.port, () => {
        logger.info(`App listening on port ${config.app.port}!`);
    });
};

if (config.environment !== 'production') {
    makeServer();
} else {
    // TODO: just testing for now
    const cluster = require('cluster');
    if (cluster.isMaster) {
        cluster.fork();
        cluster.fork();
    } else if (cluster.isWorker) {
        logger.info(`Spawned worker ${config.app.hostname}`);
        makeServer();
    }
}
