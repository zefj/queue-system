const cluster = require('cluster');
import { makeConfig } from './lib/config';
import rabbitmqConfig from './lib/rabbitmq/config';

const generateHostname = (hostname = 'host') => {
    if (cluster.isMaster) {
        return `main@${hostname}_master`; // Main server prefixed "main", ws server will be named "ws" etc.
    }

    return `main@${hostname}_${cluster.worker.id}`;
};

// You should define the base config as "development", and extend it for production and test.
// The final config will be the result of a deep-merge between "development" and whatever you pass to makeConfig()
const config = {
    development: {
        environment: process.env.NODE_ENV,
        debug: true,
        app: {
            hostname: generateHostname('devhost'),
            port: process.env.PORT || 3000,
        },
        ...rabbitmqConfig,
    },
    production: {
        app: {
            hostname: generateHostname(process.env.HOSTNAME),
        },
    },
    test: {},
};

export default makeConfig(config, process.env.NODE_ENV);
