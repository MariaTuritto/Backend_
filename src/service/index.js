import CartsService from './CartsService.js';
import ProductsService from './ProductsService.js';
import UsersService from './UsersService.js';
import TicketService from './TickesService.js';


import CartsManager from '../dao/mongo/managers/cartManager.js';
import ProductsManager from '../dao/mongo/managers/productManager.js';
import UserManager from '../dao/mongo/managers/userManager.js';
import TicketManager from '../dao/mongo/managers/ticketManager.js';

export const cartsService = new CartsService(new CartsManager());
export const productsService = new ProductsService(new ProductsManager());
export const usersService = new UsersService(new UserManager());
export const ticketService = new TicketService(new TicketManager());