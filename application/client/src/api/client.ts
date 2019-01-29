import Swagger from 'swagger-client';

export let client: {}|null = null;

const initializeClient = () => {
    return Swagger('http://localhost:3000/swagger/definitions')
        .then((swaggerClient: any) => {
            client = swaggerClient;
            return client;
        });
};

export const getClient = (): Promise<{}> => {
    if (!client) {
        return initializeClient();
    }

    return Promise.resolve(client);
};
