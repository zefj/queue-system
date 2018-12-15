import TicketEvent from './ticket-event';

class TicketCreatedEvent extends TicketEvent {
    static eventName = 'TICKET-CREATED';

    getName() {
        return TicketCreatedEvent.eventName;
    }

    getEvent() {
        return {
            name: TicketCreatedEvent.eventName,
            tenant: this.tenant,
            ticket: this.ticket,
        };
    }
}

export default TicketCreatedEvent;
