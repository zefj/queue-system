import TicketEvent from './ticket-event';

class TicketRemovedEvent extends TicketEvent {
    static eventName = 'TICKET-REMOVED';

    getName() {
        return TicketRemovedEvent.eventName;
    }

    getEvent() {
        return {
            name: TicketRemovedEvent.eventName,
            ticket: this.ticket,
        };
    }
}

export default TicketRemovedEvent;
