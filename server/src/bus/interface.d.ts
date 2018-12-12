import { EventEmitter2 } from "eventemitter2";

export interface BusInterface {
    emitter: EventEmitter2;
    emit(event: EventInterface): boolean;
    on(a: string, b: Function): this;
}

export interface EventInterface {
    getName(): string;
    getEvent(): object;
}
