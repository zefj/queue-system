import * as _ from 'lodash';

export const makeConfig = (config: {}, environment: string|undefined) => {
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
