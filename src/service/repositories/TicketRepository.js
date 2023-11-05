
export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }
  getTickets = () => {
    return this.dao.getTickets();
  };

  getTicketBy = () => {
    return this.dao.getTicketBy(params);
  };
  createTicket = (newTicket) => {
    return this.dao.createTicket(newTicket);
  };
}