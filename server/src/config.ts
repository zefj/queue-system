import * as _ from 'lodash';
const cluster = require('cluster');

const generateHostname = (hostname = 'host') => {
    if (cluster.isMaster) {
        return `main@${hostname}_master`; // Main server prefixed "main", ws server will be named "ws" etc.
    }

    return `main@${hostname}_${cluster.worker.id}`;
};

const makeConfig = (environment) => {
    if (!environment) {
        throw new Error('Environment must be set. Set NODE_ENV environment variable to one of "production", "development" or "test".');
    }

    const baseConfig = config['development'];

    if (environment === 'development') {
        return baseConfig;
    }

    // this deep-merges the configs
    return _.merge({}, baseConfig, config[environment]);
};

// You should define the base config as "development", and extend it for production and test.
// The final config will be the result of a deep-merge between "development" and whatever you pass to makeConfig()
const config = {
    development: {
        environment: process.env.NODE_ENV,
        app: {
            hostname: generateHostname('devhost'),
            port: process.env.PORT || 3000,
        },
        rabbitmq: {
            host: 'localhost',
        },
    },
    production: {
        app: {
            hostname: generateHostname(process.env.HOSTNAME),
        },
    },
    test: {},
};

export default makeConfig(process.env.NODE_ENV);
