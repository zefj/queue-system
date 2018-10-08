const Router = require('express').Router;
const queue = require('./queues/queue-controller');
const ticket = require('./tickets/ticket-controller');
const room = require('./rooms/room-controller');

const mainRouter = new Router();

mainRouter.get('/queue/get', queue.getAll);
mainRouter.post('/queue/create', queue.create);
mainRouter.post('/queue/remove', queue.remove);

mainRouter.get('/queue/:queue/room/get', room.getAll);
mainRouter.post('/queue/:queue/room/create', room.create);
mainRouter.post('/queue/:queue/room/:room/remove', room.remove);

mainRouter.post('/queue/:queue/room/:room/ticket/serve', ticket.serveNext);
mainRouter.post('/queue/:queue/room/:room/ticket/:ticket/serve', ticket.serve);

mainRouter.post('/queue/:queue/ticket/create', ticket.create);
mainRouter.post('/queue/:queue/ticket/createMany', ticket.createMany);
mainRouter.post('/queue/:queue/ticket/:ticket/remove', ticket.remove);

module.exports = mainRouter;
