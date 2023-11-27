import ticketsModel from "../models/tickets.model.js";

export default class ticketsDao {
  getTickets = (params) => {
    return ticketsModel.find(params).lean();
  };

  getTicketBy = (params) => {
    return ticketsModel.findOne(params).populate("carts.cart");
  };

  createTicket = (newTicket) => {
    return ticketsModel.create(newTicket);
  };

  updateTicket = (id, ticket) => {
    return ticketsModel.updateOne({ _id: id }, { $set: ticket });
  };

  deleteTicket = (id) => {
    return ticketsModel.deleteOne({ _id: id });
  };
}
