import { BusInterface } from '../bus/types';

import * as events from './events';

const register = (bus: BusInterface): void => {
    bus.on(events.RoomCreatedEvent.eventName, (event, ...args) => {
        logger.debug(`Received event: ${JSON.stringify(event)}, args: ${args}`);
        // logger.debug(`Got event: ${this.event.getName()}, ${JSON.stringify(this.event.getEvent())}`);
    });
};

export default register;
