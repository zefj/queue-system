import { EventInterface } from '../../bus/types';
import Room from '../room-model';

abstract class RoomEvent implements EventInterface {
    room: Room;
    tenant: string;

    constructor(tenant: string, room: Room) {
        this.tenant = tenant;
        this.room = room;
    }

    abstract getName(): string;
    abstract getEvent(): object;

    getRoom() {
        return this.room;
    }
}

export default RoomEvent;
