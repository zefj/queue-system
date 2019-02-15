const Router = require('express').Router;
const queue = require('./queues/queue-controller');
const ticket = require('./tickets/ticket-controller');
const room = require('./rooms/room-controller');

const mainRouter = new Router();

const oauth2 = require('./auth/server').default;
const auth = require('./auth/auth').default;

const config = require('./config').default;

auth.registerAuthStrategies();
oauth2.registerAuthGrantsAndExchanges();

mainRouter.post('/auth/user/authorize', (req, res, next) => {
    req.body.grant_type = 'password';
    next();
}, oauth2.middleware);

mainRouter.get('/queue/get', [
    // auth.userAuthWall, // TODO: temporarily disabled
    queue.getAll
]);
mainRouter.post('/queue/create', queue.create);
mainRouter.post('/queue/:queue/remove', queue.remove);
mainRouter.get('/queue/:queue/get', queue.getOne);

mainRouter.get('/queue/:queue/room/get', room.get);
mainRouter.post('/queue/:queue/room/create', room.create);
mainRouter.post('/room/:room/remove', room.remove);

mainRouter.post('/room/:room/ticket/serve', ticket.serveNext);
mainRouter.post('/room/:room/ticket/:ticket/serve', ticket.serve);

mainRouter.post('/queue/:queue/ticket/create', ticket.create);
// mainRouter.post('/queue/:queue/ticket/createMany', ticket.createMany);
mainRouter.post('/ticket/:ticket/remove', ticket.remove);

if (config.debug) {
    const swaggerUi = require('swagger-ui-express');
    const YAML = require('yamljs');
    mainRouter.get('/swagger/definitions', (req, res, next) => {
        const swaggerDocument = YAML.load(__dirname + '/swagger-definitions.yml');
        res.send(swaggerDocument);
        next();
    });

    mainRouter.use('/swagger', swaggerUi.serve);
    mainRouter.get('/swagger', swaggerUi.setup(null, { swaggerUrl: '/swagger/definitions' }));
}

if (config.environment === 'production') {
    const YAML = require('yamljs');
    const swaggerDocument = YAML.load(__dirname + '/swagger-definitions.yml');

    mainRouter.get('/swagger/definitions', (req, res, next) => {
        res.send(swaggerDocument);
        next();
    });
}

module.exports = mainRouter;
