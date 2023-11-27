import config from '../config/config.js';

export default class PersistenceFactory {

    static getPersistence = async() =>
    {
        let productsDao;
        let cartsDao;
        let userDao;
        let ticketsDao;
        let chatDao;


        switch(config.app.PERSISTENCE){
            case 'MONGO': {
                productsDao = (await import('./mongo/managers/productsDao.js')).default;
                cartsDao = (await import('./mongo/managers/cartsDao.js')).default;
                userDao = (await import('./mongo/managers/usersDao.js')).default;
                ticketsDao = (await import('./mongo/managers/ticketsDao.js')).default
                chatDao = (await import('./mongo/managers/chatDao.js')).default;
                break;
            }
                //falta completar
            case 'FS': {
                productsDao = (await import('./fileSystem/managers/productsDao.js')).default;
                cartsDao = (await import('./fileSystem/managers/cartsDao.js')).default;
                break;
            }  
        }
        return{
            productsDao,
            cartsDao,
            userDao,
            ticketsDao,
            chatDao,
        }
    }
}