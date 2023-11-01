import config from '../config/config.js';

export default class PersistenceFactory {

    static getPersistence = async() =>
    {
        let productsDao;
        let cartsDao;
        let userDao;
        let ticketDao


        switch(config.app.PERSISTENCE){
            case 'MONGO': {
                productsDao = (await import('./mongo/managers/productsDao.js')).default;
                cartsDao = (await import('./mongo/managers/cartsDao.js')).default;
                userDao = (await import('./mongo/managers/usersDao.js')).default;
                ticketDao = (await import('./mongo/managers/ticketsDao.js')).default
                break;
            }
                
            // case 'FS': {
            //     productsDao = (await import('./fileSystem/managers/productsDao.js')).default;
            //     cartsDao = (await import('./fileSystem/managers/cartsDao.js')).default;
            //     break;
            // }  
        }
        return{
            productsDao,
            cartsDao,
            userDao,
            ticketDao
        }
    }
}