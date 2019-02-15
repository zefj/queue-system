import Swagger from 'swagger-client';

export let client: {}|null = null;

const initializeClient = () => {
    return Swagger({
        url: 'http://localhost:3000/swagger/definitions',
    })
        .then((swaggerClient: any) => {
            client = swaggerClient;
            return client;
        }); // TODO: catch definition failed to fetch and display global error
};

export const getClient = (): Promise<any> => {
    if (!client) {
        return initializeClient();
    }

    return Promise.resolve(client);
};
