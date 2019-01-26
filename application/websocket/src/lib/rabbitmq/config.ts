import { makeConfig } from '../config';

// You should define the base config as "development", and extend it for production and test.
// The final config will be the result of a deep-merge between "development" and whatever you pass to makeConfig()
const config = {
    development: {
        environment: process.env.NODE_ENV,
        rabbitmq: {
            host: 'localhost',
        },
    },
    production: {
    },
    test: {},
};

export default makeConfig(config, process.env.NODE_ENV);
