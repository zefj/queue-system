import { BusInterface } from '../bus/types';

import * as events from './events';

const register = (bus: BusInterface): void => {
    bus.on(events.TicketCreatedEvent.eventName, (event, ...args) => {
        console.log(`Received event: ${JSON.stringify(event)}, args: ${args}`);
        // console.log(`Got event: ${this.event.getName()}, ${JSON.stringify(this.event.getEvent())}`);
    });

    bus.on(events.TicketRemovedEvent.eventName, (event, ...args) => {
        console.log(`Received event: ${JSON.stringify(event)}, args: ${args}`);
        // console.log(`Got event: ${this.event.getName()}, ${JSON.stringify(this.event.getEvent())}`);
    });

    bus.on(events.TicketServedEvent.eventName, (event, ...args) => {
        console.log(`Received event: ${JSON.stringify(event)}, args: ${args}`);
        // console.log(`Got event: ${this.event.getName()}, ${JSON.stringify(this.event.getEvent())}`);
    });
};

export default register;
