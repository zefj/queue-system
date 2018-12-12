import { BusInterface } from '../bus/interface';

import * as events from './events';

const register = (bus: BusInterface): void => {
    bus.on(events.RoomCreatedEvent.eventName, (event, ...args) => {
        console.log(`Received event: ${JSON.stringify(event)}, args: ${args}`);
        // console.log(`Got event: ${this.event.getName()}, ${JSON.stringify(this.event.getEvent())}`);
    });
};

export default register;
