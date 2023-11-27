import CartsRepository from './repositories/CartsRepository.js';
import ProductsRepository from './repositories/ProductsRepository.js';
import UsersRepository from './repositories/UsersRepository.js';
import TicketRepository from './repositories/TicketsRepository.js';
import ChatRepository from "./repositories/ChatRepository.js"
import PersistenceFactory from '../dao/persistenceFactory.js';

//TOP LEVEL AWAIT
const {productsDao, cartsDao, userDao, ticketsDao, chatDao } = await PersistenceFactory.getPersistence();

export const cartService = new CartsRepository(new cartsDao());
export const productsService = new ProductsRepository(new productsDao());
export const userService = new UsersRepository(new userDao());
export const ticketsService = new TicketRepository(new ticketsDao());
export const chatService = new ChatRepository(new chatDao());