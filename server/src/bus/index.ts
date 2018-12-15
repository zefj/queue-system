import { BusInterface, EventInterface } from './types';
import { EventEmitter2 } from 'eventemitter2';

export class Bus implements BusInterface {
    emitter: EventEmitter2;

    constructor(emitter: EventEmitter2) {
        this.emitter = emitter;
    }

    emit(event: EventInterface): boolean {
        return this.emitter.emit(
            event.getName(),
            event.getEvent(),
        );
    }

    on(a: string, b: (name: string, event: EventInterface) => void): this {
        this.emitter.on(a, b);
        return this;
    }
}

const busFactory = (): Bus => {
    const emitter = new EventEmitter2();
    return new Bus(emitter);
};

export const registerBusEventHandlers = (bus: BusInterface, modules: { (bus: BusInterface): void; }[]) => {
    modules.forEach(register => register(bus));
};

// This accomplishes the Singleton pattern
// TODO: ensure this is cache-buster-safe
export default busFactory();
