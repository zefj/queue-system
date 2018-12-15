import TicketEvent from './ticket-event';

class TicketServedEvent extends TicketEvent {
    static eventName = 'TICKET-SERVED';

    getName() {
        return TicketServedEvent.eventName;
    }

    getEvent() {
        return {
            name: TicketServedEvent.eventName,
            tenant: this.tenant,
            ticket: this.ticket,
        };
    }
}

export default TicketServedEvent;
