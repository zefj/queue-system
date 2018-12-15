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
                    // ch.assertQueue('app.task', { autoDelete: true });
                    return channel;
                });
        });
};

// This is used by the websocket server nodes to consume the bus.
// Whenever a websocket server process comes online, it calls this function to create a unique queue bound to the bus
// exchange, along a consumer.
export const consumeBus = (hostname, handler) => {
    channel.assertQueue(`bus:${hostname}`, { autoDelete: true })
        .then((queue) => {
            channel.bindQueue(queue.queue, 'app.outbound-bus');
            channel.consume(queue.queue, handler, {
                noAck: true,
                consumerTag: `bus-consumer:${hostname}`,
            });
        });
};

export const publishToBus = (message) => {
    return channel.publish('app.outbound-bus', '', new Buffer(JSON.stringify(message)));
};

// This will be used by the task workers (eg. email senders, csv parsers etc.)
// Don't know how that will work yet so this is just for future reference for now.
// const consumeTaskQueue = (hostname, handler) => {
//     throw new Error('Not implemented, this is just for future reference for now.');
//     channel.consume('app.task', handler, {
//         noAck: true,
//         consumerTag: `task-consumer:${hostname}`,
//     });
// };
