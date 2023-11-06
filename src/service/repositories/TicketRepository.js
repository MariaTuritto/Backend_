
export default class TicketRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createTicket = (newTicket) => {
    return this.dao.createTicket(newTicket);
  };
}