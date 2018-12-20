import { makeConfig } from '../../lib/config';
import rabbitmqConfig from '../../lib/rabbitmq/config';

// You should define the base config as "development", and extend it for production and test.
// The final config will be the result of a deep-merge between "development" and whatever you pass to makeConfig()
const config = {
    development: {
        environment: process.env.NODE_ENV,
        hostname: 'websocket-worker',
        port: process.env.PORT || 3069,
        ...rabbitmqConfig,
    },
    production: {
    },
    test: {},
};

export default makeConfig(config, process.env.NODE_ENV);
