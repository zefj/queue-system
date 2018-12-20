import WebSocket = require('ws');

export class WebSocketExtended extends WebSocket {
    id?: string;
    authorized?: AuthorizedClient;
    scopes?: [];
}

// TODO: move this out of here
export interface AuthorizedClient {
    tenant: string;
    queues: []|string;
}
