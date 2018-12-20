import * as ws from 'ws';
import config from './config';
import * as rabbitmq from '../../lib/rabbitmq';
import { parseMessage } from './parse-message';

import * as uuid from 'uuid/v4';
import ConnectionHandler from './connection-handler';

// Types
import { WebSocketExtended } from './types';

import './logger';

logger.info(`Starting websocket server at port ${config.port}...`);

// TODO: https
const handler = new ConnectionHandler();

const startServer = () => {
    const wss: ws.Server = new ws.Server({
        port: config.port,
    });

    wss.on('connection', (ws: WebSocketExtended) => {
        // @ts-ignore
        ws.id = uuid();

        // @ts-ignore
        logger.debug(`[${ws.id}] Client connected`);

        ws.on('message', (data) => {
            const message = parseMessage(data);

            if (message.type === 'authorize') {
                try {
                    return handler.registerConnection(message, ws);
                } catch (error) {
                    return ws.close(1000, 'Failed to authorize or register connection');
                }
            }

            ws.send('Sorry, we\'re closed!');
        });

        ws.on('close', () => handler.unregisterConnection(ws));
    });

    return wss;
};

const connectToBroker = () => {
    rabbitmq.consumeBus(config.hostname, (message) => {
        logger.debug(`Got event from queue: ${message.content}`);
        const content = JSON.parse(message.content);

        if (!content.tenant) {
            throw new Error('Received an event that does not specify the tenant. This is a critical vulnerability, all events should specify the tenant.');
        }

        // TODO: will probably need to differentiate event types. This would allow to register to various topics and
        // send messages that do not necessarily have a queue_id specified.
        // Might accomplish that by imlementing "emitToScope()" in websocket handler
        handler.emit(`${content.tenant}.*.${content.ticket.queue_id}`, message.content.toString());
    });
};

startServer();
rabbitmq.setup(config.rabbitmq.host).then(connectToBroker);
