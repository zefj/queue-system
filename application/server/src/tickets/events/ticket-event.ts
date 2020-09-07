import { EventInterface } from '../../bus/types';
import Ticket from '../ticket-model';

abstract class TicketEvent implements EventInterface {
    ticket: Ticket;
    tenant: string;

    constructor(tenant: string, ticket: Ticket) {
        this.tenant = tenant;
        this.ticket = ticket;
    }

    abstract getName(): string;
    abstract getEvent(): object;

    getTicket() {
        return this.ticket;
    }
}

export default TicketEvent;
