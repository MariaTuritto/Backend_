import CartsRepository from './repositories/CartsRepository.js';
import ProductsRepository from './repositories/ProductRepository.js';
import UsersRepository from './repositories/UsersRepository.js';
import TicketRepository from './repositories/TicketRepository.js';

import PersistenceFactory from '../dao/persistenceFactory.js';

//TOP LEVEL AWAIT
const {productsDao, cartsDao, userDao, ticketDao } = await PersistenceFactory.getPersistence();

export const cartService = new CartsRepository(new cartsDao());
export const productsService = new ProductsRepository(new productsDao());
export const userService = new UsersRepository(new userDao());
export const ticketService = new TicketRepository(new ticketDao());

