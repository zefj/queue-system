import * as amqp from 'amqplib';

let connection;
let channel;

// nice reference: http://blog.thedigitalcatonline.com/blog/2013/08/21/some-tips-about-amqp-direct-exchanges/
export const setup = (hostname) => {
    return amqp.connect(`amqp://${hostname}`)
        .then((conn) => {
            connection = conn;
            return conn.createChannel()
                .then((ch) => {
                    channel = ch;
                    ch.assertExchange('app.outbound-bus', 'direct', { durable: false });
                    // This is useless for now, I leave that here for future reference.
                    ch.assertQueue('app.task', { autoDelete: true });
                    return channel;
                });
        });
};

// This will be used by the websocket server nodes to consume the bus.
// Don't know how that library works yet so do not use this for now.
// TODO: Revise this when we implement SocketCluster.
const consumeBus = (hostname, handler) => {
    throw new Error('Not implemented, this is just for future reference for now.');
    channel.assertQueue(`bus:${hostname}`, { autoDelete: true })
        .then((queue) => {
            channel.bindQueue(queue.queue, 'app.outbound-bus', 'bus');
            channel.consume(queue.queue, handler, {
                noAck: true,
                consumerTag: `bus-consumer:${hostname}`,
            });
        });
};

// This will be used by the task workers (eg. email senders, csv parsers etc.)
// Don't know how that will work yet so this is just for future reference for now.
const consumeTaskQueue = (hostname, handler) => {
    throw new Error('Not implemented, this is just for future reference for now.');
    channel.consume('app.task', handler, {
        noAck: true,
        consumerTag: `task-consumer:${hostname}`,
    });
};
