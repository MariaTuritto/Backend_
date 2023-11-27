
export default class TicketsRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getTicketsBy = (params) => {
    return this.dao.getTicketsBy(params, { populate: true });
  };

  createTicket = (newTicket) => {
    return this.dao.createTicket(newTicket);
  };

  updateTicket = (id, ticket) => {
    return this, dao.updateTicket(id, ticket);
  };

  deleteTicket = (id) => {
    return this, dao.deleteTicket(id);
  };
}