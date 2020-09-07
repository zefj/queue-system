import RoomEvent from './room-event';

class RoomCreatedEvent extends RoomEvent {
    static eventName = 'ROOM-CREATED';

    getName() {
        return RoomCreatedEvent.eventName;
    }

    getEvent() {
        return {
            name: RoomCreatedEvent.eventName,
            room: this.room,
        };
    }
}

export default RoomCreatedEvent;
