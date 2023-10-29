export default class TicketService {
    constructor(manager) {
      this.manager = manager;
    }
    getTicket = () => {
      return this.manager.getTicket();
    };
  
    getTicketById = () => {
      return this.manager.getTicketById(params);
    };
    createTicket = () => {
      return this.manager.createTicket();
    };
    updateTicket = () => {
      return this.manager.updateTicket(id, ticket);
    };
    deleteTicket = () => {
      return this.manager.deleteTicket(id);
    };
  }