
import ticketsModel from '../models/tickets.model.js';

export default class ticketDao {

    getTickets = (params) => {
      return  ticketsModel.find(params).lean();
    };
    getTicketBy = (params) => {
      return ticketsModel.findOne(params).populate("carts.cart");
    };
    createTicket = (newTicket) => {
      return ticketsModel.create(newTicket);
    };
  }