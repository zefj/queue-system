const Router = require('express').Router;
const queue = require('./queues/queue-controller');
const ticket = require('./tickets/ticket-controller');
const room = require('./rooms/room-controller');

const mainRouter = new Router();

const oauth2 = require('./auth/server').default;
const auth = require('./auth/auth').default;

auth.registerAuthStrategies();
oauth2.registerAuthGrantsAndExchanges();

mainRouter.post('/auth/user/authorize', (req, res, next) => {
    req.body.grant_type = 'password';
    next();
}, oauth2.middleware);

mainRouter.get('/queue/get', [
    auth.userAuthWall,
    queue.getAll
]);
mainRouter.post('/queue/create', queue.create);
mainRouter.post('/queue/:queue/remove', queue.remove);

mainRouter.get('/queue/:queue/room/get', room.getAll);
mainRouter.post('/queue/:queue/room/create', room.create);
mainRouter.post('/room/:room/remove', room.remove);

mainRouter.post('/room/:room/ticket/serve', ticket.serveNext);
mainRouter.post('/room/:room/ticket/:ticket/serve', ticket.serve);

mainRouter.post('/queue/:queue/ticket/create', ticket.create);
// mainRouter.post('/queue/:queue/ticket/createMany', ticket.createMany);
mainRouter.post('/ticket/:ticket/remove', ticket.remove);

module.exports = mainRouter;
