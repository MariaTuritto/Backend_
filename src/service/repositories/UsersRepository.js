export default class UsersService {
    constructor(dao) {
        this.dao = dao;
    }

    getUser = () => {
        return this.dao.getUser(params)
    }

    getUserBy = (uid) => {
        return this.dao.getUserBy(uid);

    }

    createUser = () => {
        return this.dao.createUser(user)
    }

    updateUser = () =>{
        return this.dao.updateUser(uid, user);
    }

    deleteUser = () => {
        return this.dao.deleteUser(uid)
    }
}