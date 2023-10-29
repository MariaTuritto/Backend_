import {
    ticketsService,
    cartsService,
    usersService,
  } from "../services/index.js";
  
  const getTicket = async (req, res) => {
    const result = await ticketsService.getTicket();
    res.send({ status: "success", payload: result });
  };
  
  const getTicketById = async (req, res) => {
    const { tid } = req.params;
    const ticket = await ticketsService.getTicketById(tid);
    if (!ticket)
      return res
        .status(404)
        .send({ status: "error", message: "Ticket not found" });
    res.send({ status: "success", payload: ticket });
  };
  const createTicket = async (req, res) => {
    const result = await ticketsService.createTicket();
    res.send({ status: "success", payload: result._id });
  };
  
  const updateTicket = async (req,res) => {
    const { tid} = req.params;
    const ticket = await ticketsService.getTicketById({_id: tid});
    if(!ticket)
    return res.status(404).send({status:"error", message:"Ticket not found"});
   const result = await ticketsService.updateTicket(tid, req.body);
    res.send({status: "success", payload: result})
  }

const deleteTicket = async (req,res) => {
    const {tid} = req.params;
    const ticket = await ticketsService.getTicketById({_id: tid});
    if(!ticket)
    return res.status(400).send({ status: "error", message: "ticket not found" });
    await usersService.deleteTicket(tid);
    res.send({status: "success", message: "Ticket deleted successfully"})
}

  export default {
    getTicket,
    getTicketById,
    createTicket,
    updateTicket,
    deleteTicket,
  };