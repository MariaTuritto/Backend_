import ticketModel from "../models/tickets.model.js";

export default class TicketManager {

    getTicket = (params) => {
        return ticketModel.find(params)
    };
    
    getTicketBy = (params) => {
        return ticketModel.findOne(params).populate("carts.cart");
    };

    createTicket = () => {
        return ticketModel.create({carts: [], populate: true});
    };

    updateTicket = (id, ticket) => {
        return ticketModel.updateOne({_id: id}, {$set: ticket})
    };

    deleteTicket = (id) => {

        return ticketModel.deleteOne({_id:id});
    };

}