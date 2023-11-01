export default class UsersService {
    constructor(dao) {
        this.dao = dao;
    }

    getUser = () => {
        return this.dao.getUser(params)
    }

    getUserBy = (params) => {
        return this.dao.getUserBy(params);

    }

    createUser = () => {
        return this.dao.createUser(user)
    }

    updateUser = () =>{
        return this.dao.updateUser(id, user);
    }

    deleteUser = () => {
        return this.dao.deleteUser(id)
    }
}