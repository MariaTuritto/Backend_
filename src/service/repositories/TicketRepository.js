export default class TicketService {
    constructor(dao) {
      this.dao = dao;
    }

    getTicket = () => {
      return this.dao.getTicket();
    };
  
    getTicketById = () => {
      return this.dao.getTicketById(params);
    };
    createTicket = () => {
      return this.dao.createTicket();
    };
    updateTicket = () => {
      return this.dao.updateTicket(id, ticket);
    };
    deleteTicket = () => {
      return this.dao.deleteTicket(id);
    };
  }