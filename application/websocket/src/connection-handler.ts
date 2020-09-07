import * as _ from 'lodash';
import * as errors from 'common-errors';

import { EventEmitter2 } from 'eventemitter2';
import { AuthorizedClient, WebSocketExtended } from './types';

/**
 * The emitter is a means to manage websocket collection communication and handle wildcard routing.
 * Technically this could be accomplished by RabbitMQ topics, however this would mean we would have to create
 * at least 1 binding per connection (almost always more than that though). This is expensive and apparently is very bad
 * once you need to scale. If you do routing in RabbitMQ, upon losing a websocket node, all clients have to reconnect,
 * therefore they hit RabbitMQ with requests to create queue bindings, which can shut down the entire cluster. What
 * more, you still have to do some basic management on application layer, eg. to send messages to correct connections.
 * I decided to make RabbitMQ a direct exchange with one queue/binding per wss process, and then handle all routing
 * here. It is subject to be benchmarked and load-tested yet.
 * TODO: consider standardising the topic strings with a generator function
 */
class ConnectionHandler extends EventEmitter2 {
    constructor() {
        super({ wildcard: true });
    }

    isRegistered(connection) {
        return !_.isEmpty(this.listeners(`*.${connection.id}.*`));
    }

    registerConnection(message, connection: WebSocketExtended): boolean {
        if (this.isRegistered(connection)) {
            console.log(`[${connection.id}] Already authorized and registered`);
            return false;
        }

        this.authorizeConnection(message.token, connection);

        // temporary todo
        // The idea behind this is to handle all the scopes we come up with with the same code. Scopes might be eg.
        // "tickets" - for subscribing to ticket changes, "status" - for subscribing to queue status and statistics etc.
        message.scopes = ['tickets'];

        this.registerScopes(message.scopes, connection);
        return true;
    }

    unregisterConnection(connection: WebSocketExtended): boolean {
        console.log(`[${connection.id}] Removing ${this.listeners(`*.${connection.id}.*`).length} listeners...`);
        this.removeAllListeners(`*.${connection.id}.*`);
        return true;
    }

    // TODO
    private authorizeConnection(token, connection: WebSocketExtended) {
        console.log(`[${connection.id}] Authorizing...`);

        // just a stub for now TODO
        const client: AuthorizedClient = {
            tenant: 'queue_db', // very important
            // queues: [1, 3], // this will come from permissions
            queues: 'all',
        };

        connection.authorized = client;

        if (!connection.authorized) {
            throw new errors.AuthenticationRequiredError('Failed to authorize based on supplied token.');
        }
    }

    registerScopes(scopes: [], connection: WebSocketExtended) {
        connection.scopes = [];

        scopes.forEach(scope => this.registerScope(scope, connection));
    }

    private registerScope(scope: string, connection) {
        connection.scopes = connection.scopes.concat(scope);

        switch (scope) {
        case 'tickets':
            return this.registerTicketScope(connection);
        default:
            throw new Error('Scope is required.');
        }
    }

    private registerTicketScope(connection: WebSocketExtended) {
        const client = connection.authorized;

        if (client && client.queues instanceof Array) {
            client.queues.forEach((queueId) => {
                console.log(`[${connection.id}] Registering ${client.tenant}.${connection.id}.${queueId}`);
                this.on(`${client.tenant}.${connection.id}.${queueId}`, (event) => {
                    console.log(`[${client.tenant}.${connection.id}.${queueId}] Sending ${event}...`);
                    connection.send(event);
                });
            });
        }

        if (client && client.queues === 'all') {
            console.log(`[${connection.id}] Registering ${client.tenant}.${connection.id}.*`);
            this.on(`${client.tenant}.${connection.id}.*`, (event) => {
                console.log(`[${client.tenant}.${connection.id}.*] Sending ${event}...`);
                connection.send(event);
            });
        }
    }
}

export default ConnectionHandler;
